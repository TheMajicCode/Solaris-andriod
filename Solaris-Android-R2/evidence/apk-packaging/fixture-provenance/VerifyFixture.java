import java.io.*;
import java.nio.file.*;
import java.security.*;
import java.security.interfaces.*;
import java.util.*;

/** Authenticated local key loading; emits public facts and certificate only. Never signs. */
public final class VerifyFixture {
  public static void main(String[] args) throws Exception {
    char[] password = new BufferedReader(new InputStreamReader(System.in)).readLine().toCharArray();
    KeyStore store = KeyStore.getInstance("JKS");
    try (InputStream in = Files.newInputStream(Path.of(args[0]))) { store.load(in, password); }
    int entries = 0;
    String digest = null;
    boolean rsaComponentsMatch = true;
    for (Enumeration<String> aliases = store.aliases(); aliases.hasMoreElements();) {
      String alias = aliases.nextElement();
      if (!store.isKeyEntry(alias)) continue;
      Key key = store.getKey(alias, password);
      PublicKey publicKey = store.getCertificate(alias).getPublicKey();
      if (!(key instanceof RSAPrivateCrtKey) || !(publicKey instanceof RSAPublicKey)) {
        throw new IllegalStateException("UNSUPPORTED_PUBLIC_COMPONENT_COMPARISON");
      }
      RSAPrivateCrtKey privateRsa = (RSAPrivateCrtKey) key;
      RSAPublicKey publicRsa = (RSAPublicKey) publicKey;
      rsaComponentsMatch &= privateRsa.getModulus().equals(publicRsa.getModulus())
        && privateRsa.getPublicExponent().equals(publicRsa.getPublicExponent());
      byte[] certificate = store.getCertificate(alias).getEncoded();
      digest = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(certificate));
      if (!digest.equals("fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c")) {
        throw new IllegalStateException("CERTIFICATE_MISMATCH");
      }
      Files.write(Path.of(args[1]), certificate, StandardOpenOption.CREATE_NEW);
      entries++;
    }
    Arrays.fill(password, '\0');
    if (entries != 1 || !rsaComponentsMatch) throw new IllegalStateException("KEY_COMPONENT_MISMATCH");
    System.out.printf("{\"loadableKeyEntries\":%d,\"publicComponentsMatchCertificate\":%s,\"certificateSha256\":\"%s\",\"privateKeyMaterialExported\":false,\"apkSigned\":false}%n", entries, rsaComponentsMatch, digest);
  }
}
