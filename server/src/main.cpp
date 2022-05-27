#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <WebSocketsServer.h>
#include <Adafruit_NeoPixel.h>

#define LED_PIN 6
#define LED_COUNT 300
#define BRIGHTNESS 50

ESP8266WiFiMulti WiFiMulti;
WebSocketsServer webSocket = WebSocketsServer(81);
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRBW + NEO_KHZ800);

int currentByte = 0;

uint8_t pixelRed = 0;
uint8_t pixelGreen = 0;
uint8_t pixelBlue = 0;
uint8_t pixelWhite = 0;

bool pixelReceived = false;
bool frameReceived = false;

void handleByte(uint8_t * payload) {
  /*
    1 pixel = 4 bytes
    1 frame = (LED_COUNT) pixels
    1 frame = 4 * (LED_COUNT) bytes
  */

  // Load color channel bytes into memory
  switch (currentByte % 4)
  {
    case 0: { // Red byte
      pixelRed = *payload;
      currentByte++;
    } break;

    case 1: { // Green byte
      pixelGreen = *payload;
      currentByte++;
    } break;

    case 2: { // Blue byte
      pixelBlue = *payload;
      currentByte++;
    } break;

    case 3: { // White byte
      pixelWhite = *payload;
      currentByte++;

      // Set pixel color after all 4 bytes have been received
      pixelReceived = true;
    } break;  

    default:
      break;
  }

  // loop back to 0 after one frame has been received
  if (currentByte == LED_COUNT * 4 + 1) {
    currentByte = 0;
    frameReceived = true;
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED: {
      Serial1.printf("[%u] Disconnected!\n", num);
    } break;

    case WStype_CONNECTED: {
      Serial1.printf("[%u] Connected!\n", num);
    } break;

    case WStype_BIN: {
      handleByte(payload);
    } break;

  default:
    break;
  }
}

void setup() {
  Serial1.begin(115200);
  Serial1.setDebugOutput(true);

  for(uint8_t t = 4; t > 0; t--) {
    Serial1.printf("[SETUP] BOOT WAIT %d...\n", t);
    Serial1.flush();
    delay(1000);
  }

  strip.begin();
  strip.show();
  strip.setBrightness(BRIGHTNESS);

  WiFiMulti.addAP("SSID", "passpasspass");
  while(WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
  if (pixelReceived) {
    strip.setPixelColor(currentByte/4-1, pixelRed, pixelGreen, pixelBlue, pixelWhite);
    pixelReceived = false;
  }
  if (frameReceived) {
    strip.show();
    frameReceived = false;
  } 
}