package com.eikospartners.windowmanagerjsdemo;

import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    public static ObservableList ApplicationLog = FXCollections.observableArrayList();

    public static void logMessage(String msg){
        ApplicationLog.add(msg);
    }

    public void start(Stage primaryStage) throws Exception {
        FXMLLoader fxmlLoader = new FXMLLoader();
        Parent root = fxmlLoader.load(getClass().getResource("/MainWindow.fxml"));

        primaryStage.setTitle("WindowManager OpenFin Inter Application Bus Demo");
        primaryStage.setScene(new Scene(root, 500, 400));
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
