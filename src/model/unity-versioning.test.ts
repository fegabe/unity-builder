import UnityVersioning from './unity-versioning';

describe('Unity Versioning', () => {
  describe('parse', () => {
    it('throws for empty string', () => {
      const pattern = UnityVersioning.unityVersionPattern;
      expect(() => UnityVersioning.parse('', pattern)).toThrow(Error);
    });

    it('parses from ProjectVersion.txt', () => {
      const projectVersionContents = `m_EditorVersion: 2019.2.11f1
      m_EditorVersionWithRevision: 2019.2.11f1 (5f859a4cfee5)`;
      const pattern = UnityVersioning.unityVersionPattern;
      expect(UnityVersioning.parse(projectVersionContents, pattern)).toBe('2019.2.11f1');
    });

    it('parses from ProjectSettings.asset', () => {
      const projectSettingsContents = `  m_SupportedAspectRatios:
    4:3: 1
    5:4: 1
    16:10: 1
    16:9: 1
    Others: 1
  bundleVersion: 0.1(16)
  preloadedAssets: []
  metroInputSource: 0`;
      const pattern = UnityVersioning.projectVersionPattern;
      expect(UnityVersioning.parse(projectSettingsContents, pattern)).toBe('0.1(16)');
    });
  });

  describe('read', () => {
    it('throws for invalid path', () => {
      expect(() => UnityVersioning.readUnityVersion('', '')).toThrow(Error);
    });

    it('reads from test-project', () => {
      const pattern = UnityVersioning.unityVersionPattern;
      expect(UnityVersioning.readUnityVersion('./test-project', pattern)).toBe('2019.2.11f1');
    });
  });

  describe('determineUnityVersion', () => {
    it('defaults to parsed version', () => {
      expect(UnityVersioning.determineUnityVersion('./test-project', 'auto')).toBe('2019.2.11f1');
    });

    it('use specified unityVersion', () => {
      expect(UnityVersioning.determineUnityVersion('./test-project', '1.2.3')).toBe('1.2.3');
    });

    it('defaults to parsed version', () => {
      expect(UnityVersioning.determineProjectVersion('./test-project', 'auto')).toBe('0.1');
    });

    it('use specified unityVersion', () => {
      expect(UnityVersioning.determineProjectVersion('./test-project', '1.2.3')).toBe('1.2.3');
    });
  });
});
