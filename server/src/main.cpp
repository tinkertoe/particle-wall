#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiUdp.h>
#include <NeoPixelBus.h>

// GPIO2
#define LED_COUNT 300
#define BRIGHTNESS 0.5

ESP8266WiFiMulti wifiMulti;
WiFiUDP udp;
NeoPixelBus<NeoGrbwFeature, NeoEsp8266Uart0Sk6812Method> strip(LED_COUNT);

uint8_t bytes[LED_COUNT*4];

uint8_t pixelRed = 0;
uint8_t pixelGreen = 0;
uint8_t pixelBlue = 0;
uint8_t pixelWhite = 0;

void setup() {
  // Serial.begin(921600);
  // Serial.setDebugOutput(true);

  for(uint8_t t = 4; t > 0; t--) {
    // Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
    // Serial.flush();
    delay(1000);
  }

  wifiMulti.addAP("WLAN-798285", "42700268473287425521");
  while(wifiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  strip.Begin();
  strip.Show();

  udp.begin(14037);
}

void loop() {
  if (udp.parsePacket()) {
    size_t length = udp.readBytes(bytes, LED_COUNT*4);
    for (size_t i = 0; i < length; i++) {
      switch (i % 4) {
        case 0: { // Red byte
          pixelRed = bytes[i];
        } break;

        case 1: { // Green byte
          pixelGreen = bytes[i];
        } break;

        case 2: { // Blue byte
          pixelBlue = bytes[i];
        } break;

        case 3: { // White byte
          pixelWhite = bytes[i];

          // Set pixel color after all 4 bytes have been received
          strip.SetPixelColor(i/4-1, RgbwColor(pixelRed, pixelGreen, pixelBlue, (255-pixelWhite)));
        } break;  

        default:
          break;
      }
    }

    strip.Show();
  }
}