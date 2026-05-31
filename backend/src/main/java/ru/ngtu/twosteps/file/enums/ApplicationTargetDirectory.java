package ru.ngtu.twosteps.file.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * @author Egor Bokov
 */
@Getter
@RequiredArgsConstructor
public enum ApplicationTargetDirectory implements TargetDirectory {

    ACHIEVEMENTS_IMAGES(Values.ACHIEVEMENTS_IMAGES_VALUE),
    ROUTE_IMAGES(Values.ROUTE_IMAGES_VALUE),
    LANDMARK_IMAGES(Values.LANDMARK_IMAGES_VALUE),
    AUDIO_GUIDE_FILES(Values.AUDIO_GUIDE_FILES_VALUE);

    private final String directory;

    public static class Values {
        public static final String ACHIEVEMENTS_IMAGES_VALUE = "/achievements/images/";
        public static final String ROUTE_IMAGES_VALUE = "/routes/images/";
        public static final String LANDMARK_IMAGES_VALUE = "/landmarks/images/";
        public static final String AUDIO_GUIDE_FILES_VALUE = "/audio-guides/files/";
    }
}
