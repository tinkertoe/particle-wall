#include <bcm2835.h>
#include <time.h>
#include <sys/time.h>
#include <sys/resource.h>
#include <stdio.h>
#include <unistd.h>

#define PIN RPI_GPIO_P1_07

struct timespec T0H = {0, 200};
struct timespec T0L = {0, 1000};
struct timespec T1H = {0, 580};
struct timespec T1L = {0, 620};
struct timespec TRST = {0, 80000};

void T0() {
  bcm2835_gpio_write(PIN, HIGH);
  nanosleep(&T0H, &T0H);
  bcm2835_gpio_write(PIN, LOW);
  nanosleep(&T0L, &T0L);
}

void T1() {
  bcm2835_gpio_write(PIN, HIGH);
  nanosleep(&T1H, &T1H);
  bcm2835_gpio_write(PIN, LOW);
  nanosleep(&T1L, &T1L);
}

void RST() {
  bcm2835_gpio_write(PIN, LOW);
  nanosleep(&TRST, &TRST);
}

int main() {
  if (setpriority(PRIO_PROCESS, 0, -20) == -1) {
    printf("Failed to increase process priority");
    return 1;
  }
  
  if(!bcm2835_init()) {
    printf("Failed to initialize gpio");
	  return 1;
  }

  bcm2835_gpio_fsel(PIN, BCM2835_GPIO_FSEL_OUTP);

  /*DATA*/

  return 0;
}