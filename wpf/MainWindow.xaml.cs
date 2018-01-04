using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Openfin.Desktop;
using Openfin.Desktop.Messaging;
using System.ComponentModel;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Windows;
using System.Windows.Threading;

namespace OpenfinBus
{
    public partial class MainWindow
    {
        //Constants
        protected readonly string RuntimeVersion = ConfigurationManager.AppSettings["openfin.runtime"];

        protected readonly string Uuid = ConfigurationManager.AppSettings["openfin.uuid.wpf"];
        protected readonly string JsUuid = ConfigurationManager.AppSettings["openfin.uuid.javascript"];
        protected readonly string JavaUuid = ConfigurationManager.AppSettings["openfin.uuid.java"];

        protected readonly string MainTopic = ConfigurationManager.AppSettings["openfin.topic.topic1"];

        //OpenFin
        protected Runtime Runtime;
        protected InterApplicationBus InterAppBus;
        protected List<IMessageBusSubscription<string>> Subscriptions = new List<IMessageBusSubscription<string>>();

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

                var topics = ConfigurationManager.AppSettings
                    .AllKeys
                    .Where(key => key.StartsWith("openfin.topic"))
                    .Select(key => ConfigurationManager.AppSettings[key]);

                foreach (var topic in topics)
                {
                    LogMessage("Message Bus Subscribe...");
                    Subscriptions.Add(InterApplicationBus.Subscription<string>(Runtime, topic));
                    Subscriptions.Last().MessageReceived += (s, e) => LogMessage(e.Message);
                }
            });
        }

        protected void LogMessage(string msg)
        {
            //Make it thread safe
            Dispatcher.Invoke(DispatcherPriority.Render,new Action(() => LogList.Insert(0, msg)));
            Debug.WriteLine($"****-{msg}");
        }

        private void Publish_OnClick(object sender, RoutedEventArgs e)
        {
            InterAppBus.Publish(MainTopic, MessageTextBox.Text);
        }

        private void JavaButton_OnClick(object sender, RoutedEventArgs e)
        {
            InterAppBus.Send(JavaUuid, MainTopic, MessageTextBox.Text);
        }

        private void JsButton_OnClick(object sender, RoutedEventArgs e)
        {
            InterAppBus.Send(JsUuid, MainTopic, MessageTextBox.Text);
        }

        protected void SubscriptionListener(string uuid, string topic)
        {
            LogMessage($"SUBSCRIBER: App '{uuid}' to {topic}");

            if (uuid == JavaUuid)
                Dispatcher.Invoke(() => JavaButton.IsEnabled = true);
            else if (uuid == JsUuid)
                Dispatcher.Invoke(() => JsButton.IsEnabled = true);
        }

        protected void UnsubscriptionListener(string uuid, string topic)
        {
            LogMessage($"UNSUBSCRIBER: App '{uuid}' from {topic}");

            if (uuid == JavaUuid)
                Dispatcher.Invoke(() => JavaButton.IsEnabled = false);
            else if (uuid == JsUuid)
                Dispatcher.Invoke(() => JsButton.IsEnabled = false);
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
