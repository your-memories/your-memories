# Video transcoding in "Your Memories"

Your Memories should be able to process video files uploaded to the media folder, and integrate them in the timeline and detailed view page.

## Scenario

We assume the user to use one the following browsers:

* Chrome 81 (or newer)
* Chrome mobile 81 (or newer)
* Safari mobile 13.1 (or newer)
* Firefox 77 (or newer)

## Features

1. Videos come from a variety of sources and are usually in containers and formats that are not supported by the major browsers. Your Memories must be able to **transcode these videos into web compatible formats.**
2. The user will access her memories from mobile devices with limited connection speeds. Hence, Your Memories mus **deliver videos with appropriate resolutions and bitrates.**
3. The user wants to peek into videos without the overhead of opening them. Hence, Your Memories must **present the user some kind of video preview on the timeline.**

### Video and Audio Codec

1. Codecs supported by major browsers
2. Available hardware de- AND encoding

In first place, the **user must be able to playback** the delivered video. Hence, the major constrain is the set of supported codecs. Regarding codecs, **currently all major browser support H264 video streams with AAC audio in MP4 containers**, refer to [caniuse.com](https://caniuse.com/).

In second place, we need to **take care of the necessary resources needed to playback and transcode the video**. 
On the client site, **video playback must not cause high CPU loads in order to prevent faster battery draining**. We thus need to use a video format that can be decoded in hardware by most devices. This is given for H264.
On the server site, we should **minimize the time and load needed to transcode video into web compatible formats**. Luckily, almost any newer CPU or GPU comes with a hardware encoding unit for H264 onboard. Even Raspberry Pis can do this in hardware.

Both contrains taken together, we conclude that we use the following format for transcoded video:

* MP4 container
* H264 video codec
* AAC audio codec

Additionally, the final MP4 file must be created to support **fast start**. That means, that the video meta data must be stored at the front of the file.

### Video Resolution

For now we support up to 4k for video files. However, that created web versions are limited to:

* 480p
* 720p
* 1080p

4K web videos are difficult for us because 4K hardware encoding is not as widely spread currently, and CPU transcoding in 4K requires huge amounts of CPU power.


### Video Bitrate

These transcoding bitrates are inspired and taken from Youtube, see [here](https://support.google.com/youtube/answer/1722171?hl=en):

| Res      | Standard Frame Rate | High Frame Rate |
|:-------- | ------------------- | --------------- |
| 1080p    | 8 Mbps              | 12 Mbps         |
| 720p     | 5 Mbps              | 7.5 Mbps        |
| 480p     | 2.5 Mbps            | 4 Mbps          |
| 360p     | 1 Mbps              | 1.5 Mbps        |

### Audio Bitrate

These transcoding bitrates are inspired and taken from Youtube, see [here](https://support.google.com/youtube/answer/1722171?hl=en):

| Type   | Audio Bitrate |
| ------ | ------------- |
| Mono   | 128 kbps      |
| Stereo | 384 kbps      |
| 5.1    | 512 kbps      |
