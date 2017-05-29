package com.eikospartners.windowmanagerjsdemo.openfin;

import com.eikospartners.windowmanagerjsdemo.Main;
import com.openfin.desktop.Ack;
import com.openfin.desktop.AckListener;

public class AcknowledgeListener  implements AckListener{
    /**
     * Invoked when the request to AppDesktop is successful
     *
     * @param ack an Ack object
     * @see Ack
     */
    @Override
    public void onSuccess(Ack ack) {
        Main.logMessage(String.format("Acknowledgement %s: %s ", ack.isSuccessful(), ack.getJsonObject()));
    }

    /**
     * Invoked when the request to AppDesktop has errors
     *
     * @param ack an Ack object
     * @see Ack
     */
    @Override
    public void onError(Ack ack) {
        Main.logMessage(String.format("Acknowledgement Error %s: %s ", ack.isSuccessful(), ack.getJsonObject()));
    }
}
