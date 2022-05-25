#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClientSecure.h>

#include <WebSocketsServer.h>

ESP8266WiFiMulti WiFiMulti;
WebSocketsServer webSocket = WebSocketsServer(81);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

  switch(type) {
    case WStype_DISCONNECTED: {
      Serial1.printf("[%u] Disconnected!\n", num);
    } break;

    case WStype_CONNECTED: {
      Serial1.printf("[%u] Connected!\n", num);
    } break;

    case WStype_BIN: {
      Serial1.printf("[%u] get binary length: %u\n", num, length);
      for (size_t i = 0; i < 8; i++)
      {
        switch (bitRead(*payload, 7-i))
        {
          case 0: {

          } break;

          case 1: {

          } break;

          default:
            break;
        }
      }
      
      bitRead(byte(*payload), 0);
      
    } break;

  default:
    break;
  }

}

void setup() {
  Serial1.begin(115200);
  Serial1.setDebugOutput(true);

  Serial1.println();
  Serial1.println();
  Serial1.println();

  for(uint8_t t = 4; t > 0; t--) {
    Serial1.printf("[SETUP] BOOT WAIT %d...\n", t);
    Serial1.flush();
    delay(1000);
  }

  WiFiMulti.addAP("SSID", "passpasspass");

  while(WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
}