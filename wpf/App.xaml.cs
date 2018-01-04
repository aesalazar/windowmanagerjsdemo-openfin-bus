using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Runtime.ExceptionServices;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Threading;

namespace OpenfinBus
{
    public partial class App : Application
    {
        public App()
        {
            RegisterGlobalExceptionHandling();
        }

        #region Global Exceptions

        private static void RegisterGlobalExceptionHandling()
        {
            AppDomain.CurrentDomain.FirstChanceException += AppDomain_HandledException;
            AppDomain.CurrentDomain.UnhandledException += (sender, e) => AppDomain_OnUnhandledException(e);
            Current.DispatcherUnhandledException += (sender, e) => CurrentDispatcher_OnUnhandledException(Current, e);
            TaskScheduler.UnobservedTaskException += (sender, e) => TaskScheduler_OnUnobservedTaskException(e);
        }

        /// <summary>
        /// Log any handled exceptions for debugging.
        /// </summary>
        private static void AppDomain_HandledException(object sender, FirstChanceExceptionEventArgs e)
        {
            Debug.WriteLine(e.Exception.Message);
        }

        /// <summary>
        /// Lowest level handler across the entire app domain if everything else fails to catch it.
        /// </summary>
        private static void AppDomain_OnUnhandledException(UnhandledExceptionEventArgs e)
        {
            var exception = e.ExceptionObject as Exception;
            var terminatingMessage = e.IsTerminating ? "The application is terminating." : string.Empty;
            var exceptionMessage = exception?.Message ?? "An unmanaged exception occurred.";
            var message = $"{nameof(AppDomain_OnUnhandledException)}: {exceptionMessage} {terminatingMessage}";
            Debug.WriteLine(message);
        }

        /// <summary>
        /// Uncaught Task exceptions which will log after all references to the Task are out of scope and garbaged collected.
        /// </summary>
        private static void TaskScheduler_OnUnobservedTaskException(UnobservedTaskExceptionEventArgs e)
        {
            Debug.WriteLine($"{nameof(TaskScheduler_OnUnobservedTaskException)}: {e.Exception.Message}");
            e.SetObserved();
        }

        /// <summary>
        /// Uncaught delegate exceptions in the a Dispatcher context.
        /// </summary>
        /// <remarks>
        /// This can be wired too from any UI thread <see cref="Dispatcher"/> beginning with the main application.  If additional
        /// UI threads are created that require logging remember to explicitly wire its 
        /// <see cref="Application.DispatcherUnhandledException"/> to this handler.
        /// </remarks>
        public static void CurrentDispatcher_OnUnhandledException(object sender, DispatcherUnhandledExceptionEventArgs e)
        {
            Debug.WriteLine($"{nameof(CurrentDispatcher_OnUnhandledException)}: {sender}: {e.Exception.Message}", e.Exception);
            e.Handled = true;
        }

        #endregion

    }
}
