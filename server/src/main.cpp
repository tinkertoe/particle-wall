#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <WebSocketsServer.h>
#include <NeoPixelBus.h>

// GPIO2
#define LED_COUNT 300
#define BRIGHTNESS 50

ESP8266WiFiMulti WiFiMulti;
WebSocketsServer webSocket = WebSocketsServer(81);
NeoPixelBus<NeoGrbwFeature, NeoEsp8266AsyncUart1Sk6812Method> strip(LED_COUNT);

uint8_t pixelRed = 0;
uint8_t pixelGreen = 0;
uint8_t pixelBlue = 0;
uint8_t pixelWhite = 0;

int frameCount = 0;
size_t t1 = 0; 

void handleByte(uint8_t * payload, size_t currentByte) {
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
    } break;

    case 1: { // Green byte
      pixelGreen = *payload;
    } break;

    case 2: { // Blue byte
      pixelBlue = *payload;
    } break;

    case 3: { // White byte
      pixelWhite = *payload;

      // Set pixel color after all 4 bytes have been received
      strip.SetPixelColor(currentByte/4-1, RgbwColor(pixelRed-255-BRIGHTNESS, pixelGreen-255-BRIGHTNESS, pixelBlue-255-BRIGHTNESS, (255-pixelWhite)-255-BRIGHTNESS));
    } break;  

    default:
      break;
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_BIN) {
    for (size_t i = 0; i < length; i++) {
      handleByte(payload+i, i);
    }

    // while (!strip.CanShow()) { asm("nop"); }
    strip.Show();
    frameCount++;

    Serial.printf("%lu %i\n", millis() - t1, frameCount); 
    t1 = millis();
  }
}

void setup() {
  Serial.begin(921600);
  // Serial.setDebugOutput(true);

  for(uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  strip.Begin();
  strip.Show();

  WiFiMulti.addAP("WLAN-798285", "42700268473287425521");
  while(WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
}