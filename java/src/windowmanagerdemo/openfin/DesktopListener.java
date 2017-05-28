package windowmanagerdemo.openfin;

import com.openfin.desktop.DesktopStateListener;
import windowmanagerdemo.Main;

public class DesktopListener implements DesktopStateListener {
    /**
     * Callback when Desktop is successfully connected and ready to
     * accept commands.
     */
    @Override
    public void onReady() {
        Main.logMessage("CONNECTED!");
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
        //Main.logMessage("ERROR: " + reason);
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
}
