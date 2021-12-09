import * as fs from 'fs';
import path from 'path';

export default class UnityVersioning {
  static get unityVersionPattern() {
    return /20\d{2}\.\d\.\w{3,4}|3/;
  }
  static get projectVersionPattern() {
    return /(?<=bundleVersion: )(.+)/;
  }

  static determineUnityVersion(projectPath, unityVersion) {
    if (unityVersion === 'auto') {
      const pattern = UnityVersioning.unityVersionPattern;
      return UnityVersioning.readUnityVersion(projectPath, pattern);
    }
    return unityVersion;
  }

  static determineProjectVersion(projectPath, projectVersion) {
    if (projectVersion === 'auto') {
      const pattern = UnityVersioning.projectVersionPattern;
      return UnityVersioning.readProjectVersion(projectPath, pattern);
    }
    return projectVersion;
  }

  static readUnityVersion(projectPath, regexPattern) {
    const filePath = path.join(projectPath, 'ProjectSettings', 'ProjectVersion.txt');
    return UnityVersioning.read(filePath, regexPattern);
  }

  static readProjectVersion(projectPath, regexPattern) {
    const filePath = path.join(projectPath, 'ProjectSettings', 'ProjectSettings.asset');
    return UnityVersioning.read(filePath, regexPattern);
  }

  static read(filePath, regexPattern) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Project file not found at "${filePath}". Have you correctly set the projectPath?`);
    }
    return UnityVersioning.parse(fs.readFileSync(filePath, 'utf8'), regexPattern);
  }

  static parse(fileContent, regexPattern) {
    const matches = fileContent.match(regexPattern);
    if (!matches || matches.length === 0) {
      throw new Error(`Failed to parse version from "${fileContent}".`);
    }
    return matches[0];
  }
}
