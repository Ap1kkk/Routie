package ru.ngtu.twosteps.file;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.twosteps.file.enums.TargetDirectory;
import ru.ngtu.twosteps.common.config.properties.FileServiceConfigProperties;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    private final static String SAFE_DELETE_ERROR_PREFIX = "Caused while safe delete: {}";

    private final FileServiceConfigProperties configProperties;

    public String getFileContentByPath(String path) throws IOException {
        File file = getByPath(path);
        return getFileContent(file);
    }

    public String getFileContent(File file) throws IOException {
        StringBuilder contentBuilder = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                contentBuilder.append(line).append("\n");
            }
        }

        return contentBuilder.toString();
    }

    public String uploadWithDeleteOld(MultipartFile file, TargetDirectory targetDirectory, String oldPath) throws IOException {
        safeDelete(oldPath);
        return upload(file, targetDirectory);
    }

    public String uploadWithDeleteOld(MultipartFile file, String filename, TargetDirectory targetDirectory, String oldPath) throws IOException {
        safeDelete(oldPath);
        return upload(file, filename, targetDirectory);
    }

    public List<String> uploadWithDeleteOld(List<MultipartFile> files, TargetDirectory targetDirectory, String[] oldPaths) throws IOException {
        safeDelete(oldPaths);
        return upload(files, targetDirectory);
    }

    public List<String> upload(List<MultipartFile> files, TargetDirectory targetDirectory) throws IOException {
        List<String> filePaths = new ArrayList<>();
        if(files != null) {
            for (MultipartFile file: files) {
                filePaths.add(upload(file, targetDirectory));
            }
        }
        return filePaths;
    }

    public String upload(MultipartFile file, TargetDirectory targetDirectory) throws IOException {
        String fileUuid = UUID.randomUUID().toString();
        String filenameResult = fileUuid + "." + file.getOriginalFilename();

        return upload(file, filenameResult, targetDirectory);
    }

    public String upload(MultipartFile file, String filename, TargetDirectory targetDirectory) throws IOException {
        Path uploadDir = resolvePath(targetDirectory);
        resolveDirectory(uploadDir);

        Path filePath = uploadDir.resolve(filename);

        file.transferTo(filePath);

        return targetDirectory.getDirectory() + filename;
    }

    public String upload(String content, String filename, TargetDirectory targetDirectory) throws IOException {
        Path uploadDir = resolvePath(targetDirectory);
        resolveDirectory(uploadDir);

        Path filePath = uploadDir.resolve(filename);
        Files.write(filePath, content.getBytes());

        return targetDirectory.getDirectory() + filename;
    }

    public void delete(String path) throws IOException {
        Path fullPath = Paths.get(configProperties.getBaseUploadPath() + path).normalize();
        Files.delete(fullPath);
    }

    public void delete(String[] paths) throws IOException {
        for (String path: paths) {
            delete(path);
        }
    }

    public void safeDelete(String path) {
        try {
            delete(path);
        } catch (Exception e) {
            log.error(SAFE_DELETE_ERROR_PREFIX, e.getMessage());
        }
    }

    public void safeDelete(String[] paths) {
        if(paths != null) {
            for (String path: paths) {
                safeDelete(path);
            }
        }
    }

    public File getByPath(String path) {
        Path fullPath = Paths.get(configProperties.getBaseUploadPath() + path).normalize();
        return fullPath.toFile();
    }

    private Path resolvePath(TargetDirectory targetDirectory) {
        return Paths.get(configProperties.getBaseUploadPath() + targetDirectory.getDirectory()).normalize();
    }

    private void resolveDirectory(Path path) throws IOException {
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
    }
}
