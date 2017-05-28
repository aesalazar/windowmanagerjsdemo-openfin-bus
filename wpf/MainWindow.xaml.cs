using System;
using System.Collections.ObjectModel;
using Openfin.Desktop;
using Openfin.Desktop.Messaging;
using System.ComponentModel;
using System.Windows;
using System.Windows.Threading;

namespace OpenfinBus
{
    public partial class MainWindow
    {
        //Constants
        protected const string Uuid = "windowmanagerjsdemo-openfin-bus-wpf";
        protected const string JsUuid = "windowmanagerjsdemo-openfin-bus-javascript";
        protected const string JavaUuid = "windowmanagerjsdemo-openfin-bus-java";
        protected const string Topic = "windowmanagerjsdemo-openfin-topic1";
        protected const string RuntimeVersion = "stable";

        //OpenFin
        protected Runtime Runtime;
        protected InterApplicationBus InterAppBus;
        protected IMessageBusSubscription<string> Subscription;

        //UI properties
        protected readonly ObservableCollection<string> LogList = new ObservableCollection<string>();

        public MainWindow()
        {
            InitializeComponent();

            //Wire the list box
            MainListBox.ItemsSource = LogList;
            LogMessage("Initialized...");

            //Connect to openfin
            ConnectOpenfin();

            //When disconnecting OpenFin
            Closing += OnClosing;
        }

        protected void ConnectOpenfin()
        {
            LogMessage("Configuration...");
            var options = new RuntimeOptions { Version = RuntimeVersion, UUID = Uuid,};

            LogMessage("Connection...");
            Runtime = Runtime.GetRuntimeInstance(options);

            Runtime.OnIncommingMessage += (sender, e) => LogMessage(e.MessageContent);
            Runtime.OnOutgoingMessage += (sender, e) => LogMessage(e.MessageContent);
            Runtime.OnOutgoingMessage += (sender, e) => LogMessage(e.MessageContent);
            Runtime.Error += (sender, e) => LogMessage(e.ExceptionObject.ToString());

            Runtime.Connect(() =>
            {
                InterAppBus = Runtime.InterApplicationBus;

                LogMessage("Subscribers...");
                InterAppBus.addSubscribeListener(SubscriptionListener);

                LogMessage("Unsubscribers...");
                InterAppBus.addUnsubscribeListener(UnsubscriptionListener);

                LogMessage("Message Bus Subscribe...");
                Subscription = InterApplicationBus.Subscription<string>(Runtime, Topic);
                Subscription.MessageReceived += (s, e) => LogMessage(e.Message);
            });
        }

        protected void LogMessage(string msg)
        {
            //Make it thread safe
            Dispatcher.Invoke(DispatcherPriority.Render,new Action(() => LogList.Insert(0, msg)));
        }

        private void Publish_OnClick(object sender, RoutedEventArgs e)
        {
            InterAppBus.Publish(Topic, MessageTextBox.Text);
        }

        private void JavaButton_OnClick(object sender, RoutedEventArgs e)
        {
            InterAppBus.Send(JavaUuid, Topic, MessageTextBox.Text);
        }

        private void JsButton_OnClick(object sender, RoutedEventArgs e)
        {
            InterAppBus.Send(JsUuid, Topic, MessageTextBox.Text);
        }

        protected void SubscriptionListener(string uuid, string topic)
        {
            LogMessage($"SUBSCRIBER: App '{uuid}' to {topic}");

            switch (uuid)
            {
                case JavaUuid:
                    Dispatcher.Invoke(() => JavaButton.IsEnabled = true);
                    break;
                case JsUuid:
                    Dispatcher.Invoke(() => JsButton.IsEnabled = true);
                    break;
            }
        }

        protected void UnsubscriptionListener(string uuid, string topic)
        {
            LogMessage($"UNSUBSCRIBER: App '{uuid}' from {topic}");

            switch (uuid)
            {
                case JavaUuid:
                    Dispatcher.Invoke(() => JavaButton.IsEnabled = false);
                    break;
                case JsUuid:
                    Dispatcher.Invoke(() => JsButton.IsEnabled = false);
                    break;
            }
        }

        private void OnClosing(object sender, CancelEventArgs cancelEventArgs)
        {
            try
            {
                Runtime.System.Dispose();
                Runtime.Disconnect(() => LogMessage("Disconnected..."));
                Runtime.Dispose();
            }
            catch (Exception)
            {
                //Ignored
            }
        }

    }
}   
