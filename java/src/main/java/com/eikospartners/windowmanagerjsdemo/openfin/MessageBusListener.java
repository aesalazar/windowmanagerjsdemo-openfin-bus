package com.eikospartners.windowmanagerjsdemo.openfin;

import com.openfin.desktop.BusListener;
import com.eikospartners.windowmanagerjsdemo.Main;

/**
 * Awaits messages from a message bus.
 */
public class MessageBusListener implements BusListener {
    /**
     * Invoked when a subscrbied message is received
     *
     * @param sourceUuid Source of th message
     * @param topic      Topic of the message
     * @param payload    Message content
     */
    @Override
    public void onMessageReceived(String sourceUuid, String topic, Object payload) {
        Main.logMessage(String.format("Bus Message from %s: %s ", sourceUuid, payload.toString()));
    }
}
