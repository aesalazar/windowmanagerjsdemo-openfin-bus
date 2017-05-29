package windowmanagerdemo.openfin;

import com.openfin.desktop.DesktopStateListener;
import windowmanagerdemo.Main;
import windowmanagerdemo.helper.ReadyListener;

import java.util.ArrayList;
import java.util.List;

public class DesktopListener implements DesktopStateListener {
    /**
     * Callback when Desktop is successfully connected and ready to
     * accept commands.
     */
    @Override
    public void onReady() {
        Main.logMessage("CONNECTED!");

        for (ReadyListener listener : readyListeners)
            listener.Ready();
    }

    /**
     * Callback when connection is successfully closed
     * accept commands.
     */
    @Override
    public void onClose() {
        Main.logMessage("CLOSED!");
    }

    /**
     * Callback when client cannot start or connect to the Desktop.
     *
     * @param reason Error message
     */
    @Override
    public void onError(String reason) {
        Main.logMessage("ERROR: " + reason);
    }

    /**
     * Callback when a message is sent to this client
     *
     * @param message Message text
     */
    @Override
    public void onMessage(String message) {
        Main.logMessage("MESSAGE: " + message);
    }

    /**
     * Callback when a message is sent from this client
     *
     * @param message Message text
     */
    @Override
    public void onOutgoingMessage(String message) {
        Main.logMessage("OUTGOING: " + message);
    }

    /**
     * Collection of {@link ReadyListener}s to be called when the desktop connection signals it is ready.
     */
    protected List<ReadyListener> readyListeners = new ArrayList<>();

    /**
     * Adds {@link ReadyListener} to be called when the desktop connection signals it is ready.
     * @param listener {@link ReadyListener} to add.
     */
    public void addListener(ReadyListener listener){
        readyListeners.add(listener);
    }

    /**
     * Removes {@link ReadyListener} added by {@link #addListener(ReadyListener)}.
     * @param listener {@link ReadyListener} to remove.
     */
    public void removeListener(ReadyListener listener){
        readyListeners.remove(listener);
    }
}
