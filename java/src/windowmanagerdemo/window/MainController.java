package windowmanagerdemo.window;

import com.openfin.desktop.DesktopConnection;
import com.openfin.desktop.InterApplicationBus;
import com.openfin.desktop.RuntimeConfiguration;
import com.openfin.desktop.SubscriptionListener;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;

import javafx.application.Platform;
import javafx.beans.property.ListProperty;
import javafx.beans.property.SimpleListProperty;
import javafx.collections.FXCollections;
import javafx.collections.ListChangeListener;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.ListView;

import windowmanagerdemo.Main;
import windowmanagerdemo.helper.ReadyListener;
import windowmanagerdemo.openfin.AcknowledgeListener;
import windowmanagerdemo.openfin.DesktopListener;
import windowmanagerdemo.openfin.MessageBusListener;

import java.net.URL;
import java.util.ResourceBundle;

public class MainController implements Initializable {
    @FXML
    private ListView logListView;
    @FXML
    private VBox mainBox;
    @FXML
    private Button publishButton;
    @FXML
    private Button jsButton;
    @FXML
    private Button wpfButton;
    @FXML
    private TextField messageText;

    //Constants
    protected static final String UUID = "windowmanagerjsdemo-openfin-bus-java"; //JAVA uuid
    protected static final String JSUUID = "windowmanagerjsdemo-openfin-bus-javascript";
    protected static final String WPFUUID = "windowmanagerjsdemo-openfin-bus-wpf";
    protected static final String TOPIC = "windowmanagerjsdemo-openfin-topic1";
    protected static final String RUNTIMEVERSION = "stable";

    //OpenFin
    protected DesktopConnection desktopConnection;
    protected DesktopListener desktopListener;
    protected InterApplicationBus interApplicationBus;

    //UI properties
    protected ListProperty<String> logListProperty = new SimpleListProperty();
    protected ObservableList logList = FXCollections.observableArrayList();

    @Override
    public void initialize(URL location, ResourceBundle resources) {

        //Listen for changes here to avoid concurrency
        Main.ApplicationLog.addListener((ListChangeListener) c -> {
            Platform.runLater(() -> {
                while (c.next())
                    if (c.wasAdded())
                        logList.addAll(0, c.getAddedSubList());
            });
        });

        //Wire the list box
        logListView.itemsProperty().bind(logListProperty);
        logListProperty.set(logList);
        Main.logMessage("ListBox wired...");

        //Wire the button
        wireButtons();

        //Connect to openfin
        try {
            connectOpenfin();
        } catch (Exception ex){
            Main.logMessage("Connecting Error: " + ex.toString());
        }

        //When disconnecting OpenFin
        wireCleanup();
    }

    protected void connectOpenfin() throws Exception {
        Main.logMessage("Configuration...");
        RuntimeConfiguration runtimeConfiguration = new RuntimeConfiguration();
        runtimeConfiguration.setRuntimeVersion(RUNTIMEVERSION);

        Main.logMessage("Connection...");
        desktopListener = new DesktopListener();
        desktopListener.addListener(readyListener);
        desktopConnection = new DesktopConnection(UUID);
        desktopConnection.connect(runtimeConfiguration, desktopListener, 3000);
    }

    protected void wireButtons(){
        publishButton.setOnMouseClicked(e -> {
            try {
                interApplicationBus.publish(TOPIC, messageText.getText());
            } catch (Exception ex){
                Main.logMessage("publishButton: " + ex.toString());
            }
        });
        jsButton.setOnMouseClicked(e -> {
            try {
                interApplicationBus.send(JSUUID, TOPIC, messageText.getText());
            } catch (Exception ex){
                Main.logMessage("jsButton: " + ex.toString());
            }
        });

        wpfButton.setOnMouseClicked(e -> {
            try {
                interApplicationBus.send(WPFUUID, TOPIC, messageText.getText());
            } catch (Exception ex){
                Main.logMessage("wpfButton: " + ex.toString());
            }
        });

    }

    protected ReadyListener readyListener = new ReadyListener() {
        @Override
        public void Ready() {
            desktopListener.removeListener(readyListener);

            Main.logMessage("Subscribers...");
            interApplicationBus = desktopConnection.getInterApplicationBus();
            interApplicationBus.addSubscribeListener(subscriptionListener);

            Main.logMessage("Message Bus Subscribe...");
            try {
                interApplicationBus.subscribe(
                        "*"
                        , TOPIC
                        , new MessageBusListener()
                        , new AcknowledgeListener()
                );
            } catch (Exception ex) {
                Main.logMessage("subscribe: " + ex.toString());
            }
        }
    };

protected SubscriptionListener subscriptionListener = new SubscriptionListener() {
    @Override
    public void subscribed(String uuid, String topic) {
        Main.logMessage("SUBSCRIBER: App '"+ uuid +"' to " + topic);
        switch (uuid){
            case WPFUUID:
                wpfButton.setDisable(false);
                break;
            case JSUUID:
                jsButton.setDisable(false);
                break;
        }
    }

    @Override
    public void unsubscribed(String uuid, String topic) {
        Main.logMessage("UNSUBSCRIBER: App '"+ uuid +"' from " + topic);
        switch (uuid){
            case WPFUUID:
                wpfButton.setDisable(true);
                break;
            case JSUUID:
                jsButton.setDisable(true);
                break;
        }
    }
};

    protected void wireCleanup(){
        mainBox.sceneProperty().addListener((observableScene, oldScene, newScene) -> {
            if (oldScene == null && newScene != null) {
                // scene is set for the first time. Now its the time to listen stage changes.
                newScene.windowProperty().addListener((observableWindow, oldWindow, newWindow) -> {
                    if (oldWindow == null && newWindow != null) {
                        // stage is set. now is the right time to do whatever we need to the stage in the controller.
                        newWindow.setOnCloseRequest(we -> {
                            try {
                                interApplicationBus.removeSubscribeListener(subscriptionListener);
                                interApplicationBus.unsubscribe(
                                        "*"
                                        , TOPIC
                                        , new MessageBusListener()
                                        , new AcknowledgeListener()
                                );

                                desktopConnection.disconnect();
                            } catch (Exception ex) {
                                ex.printStackTrace();
                            }
                        });
                    }
                });
            }
        });
    }
}
