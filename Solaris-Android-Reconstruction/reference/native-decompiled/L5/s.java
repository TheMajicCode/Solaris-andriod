package L5;

import android.content.Context;
import android.security.keystore.KeyGenParameterSpec$Builder;
import android.util.AtomicFile;
import com.facebook.react.fabric.mounting.mountitems.IntBufferBatchMountItem;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.security.InvalidAlgorithmParameterException;
import java.security.Key;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import kotlin.Pair;
import org.json.JSONException;
import org.json.JSONObject;
import p027d5.AbstractC0678a;
import p027d5.C0681d;
import p143v3.AbstractC0975j;
import p143v3.AbstractC0982q;
import p143v3.L;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class s {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final Context f1849a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private final String f1850b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private final File f1851c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    private final AtomicFile f1852d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    private JSONObject f1853e;

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    private final AtomicFile f1854f;

    public s(Context context) {
        J3.l.f(context, "context");
        this.f1849a = context;
        this.f1850b = "solaris.vault.wrap.v1";
        File file = new File(context.getFilesDir(), "solaris-vault/v1");
        file.mkdirs();
        this.f1851c = file;
        this.f1852d = new AtomicFile(new File(file, "keys.sealed"));
        this.f1854f = new AtomicFile(new File(file, "core.initialized"));
    }

    public static /* synthetic */ CharSequence a(byte b6) {
        return j(b6);
    }

    public static /* synthetic */ CharSequence b(byte b6) {
        return g(b6);
    }

    private final String e(int i6) {
        byte[] bArr = new byte[i6];
        new SecureRandom().nextBytes(bArr);
        return AbstractC0975j.Z(bArr, "", null, null, 0, null, new r(), 30, null);
    }

    static /* synthetic */ String f(s sVar, int i6, int i7, Object obj) {
        if ((i7 & 1) != 0) {
            i6 = 32;
        }
        return sVar.e(i6);
    }

    private static final CharSequence g(byte b6) {
        String str = String.format("%02x", Arrays.copyOf(new Object[]{Byte.valueOf(b6)}, 1));
        J3.l.e(str, "format(...)");
        return str;
    }

    private static final CharSequence j(byte b6) {
        String str = String.format("%02x", Arrays.copyOf(new Object[]{Byte.valueOf(b6)}, 1));
        J3.l.e(str, "format(...)");
        return str;
    }

    private final SecretKey o() throws NoSuchAlgorithmException, UnrecoverableKeyException, IOException, KeyStoreException, CertificateException {
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);
        Key key = keyStore.getKey(this.f1850b, null);
        SecretKey secretKey = key instanceof SecretKey ? (SecretKey) key : null;
        if (secretKey != null) {
            return secretKey;
        }
        throw new IllegalStateException("VAULT_KEY_UNAVAILABLE");
    }

    public final JSONObject c() {
        JSONObject jSONObject = this.f1853e;
        if (jSONObject != null) {
            return jSONObject;
        }
        throw new IllegalStateException("VAULT_LOCKED");
    }

    public final boolean d() {
        return this.f1852d.getBaseFile().exists() || new File(this.f1851c, "keys.sealed.bak").exists();
    }

    public final void h() {
        this.f1853e = null;
    }

    public final String i(String str) throws JSONException {
        J3.l.f(str, "text");
        byte[] bytes = str.getBytes(C0681d.f11148b);
        J3.l.e(bytes, "getBytes(...)");
        if (bytes.length > 65536) {
            throw new IllegalArgumentException("RECEIPT_SIZE");
        }
        String string = c().getString("receiptKey");
        J3.l.e(string, "getString(...)");
        List listC1 = p027d5.q.c1(string, 2);
        ArrayList arrayList = new ArrayList(AbstractC0982q.u(listC1, 10));
        Iterator it = listC1.iterator();
        while (it.hasNext()) {
            arrayList.add(Byte.valueOf((byte) Integer.parseInt((String) it.next(), AbstractC0678a.a(16))));
        }
        byte[] bArrG0 = AbstractC0982q.G0(arrayList);
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(bArrG0, "HmacSHA256"));
            byte[] bytes2 = str.getBytes(C0681d.f11148b);
            J3.l.e(bytes2, "getBytes(...)");
            byte[] bArrDoFinal = mac.doFinal(bytes2);
            J3.l.e(bArrDoFinal, "doFinal(...)");
            return AbstractC0975j.Z(bArrDoFinal, "", null, null, 0, null, new q(), 30, null);
        } finally {
            AbstractC0975j.o(bArrG0, (byte) 0, 0, 0, 6, null);
        }
    }

    public final void k() throws Exception {
        c();
        if (this.f1854f.getBaseFile().exists()) {
            return;
        }
        FileOutputStream fileOutputStreamStartWrite = this.f1854f.startWrite();
        try {
            fileOutputStreamStartWrite.write(new byte[]{1});
            this.f1854f.finishWrite(fileOutputStreamStartWrite);
        } catch (Exception e6) {
            this.f1854f.failWrite(fileOutputStreamStartWrite);
            throw e6;
        }
    }

    public final Map l(boolean z6, String str, JSONObject jSONObject) throws Exception {
        String string;
        String strF;
        String strF2;
        String string2;
        String string3 = str;
        J3.l.f(string3, "subject");
        if (d()) {
            if (jSONObject != null) {
                throw new IllegalArgumentException("VAULT_ALREADY_EXISTS");
            }
            byte[] fully = this.f1852d.readFully();
            if (fully.length <= 28) {
                throw new IllegalArgumentException("VAULT_KEY_UNAVAILABLE");
            }
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecretKey secretKeyO = o();
            J3.l.c(fully);
            cipher.init(2, secretKeyO, new GCMParameterSpec(IntBufferBatchMountItem.INSTRUCTION_UPDATE_LAYOUT, AbstractC0975j.j(fully, 0, 12)));
            byte[] bytes = "solaris-native-owner/1".getBytes(C0681d.f11148b);
            J3.l.e(bytes, "getBytes(...)");
            cipher.updateAAD(bytes);
            byte[] bArrDoFinal = cipher.doFinal(fully, 12, fully.length - 12);
            try {
                b bVar = b.f1735a;
                J3.l.c(bArrDoFinal);
                this.f1853e = new JSONObject(bVar.e(bArrDoFinal));
                AbstractC0975j.o(bArrDoFinal, (byte) 0, 0, 0, 6, null);
            } catch (Throwable th) {
                J3.l.c(bArrDoFinal);
                AbstractC0975j.o(bArrDoFinal, (byte) 0, 0, 0, 6, null);
                throw th;
            }
        } else {
            if (!z6) {
                throw new IllegalArgumentException("VAULT_NOT_CREATED");
            }
            JSONObject jSONObject2 = jSONObject != null ? jSONObject.getJSONObject("ownerCapsule") : null;
            if (jSONObject2 != null) {
                string3 = jSONObject2.getString("subjectId");
            } else if (string3.length() == 0) {
                string3 = "sol_" + e(16);
            }
            J3.l.c(string3);
            if (!new p027d5.o("sol_[a-f0-9]{32}").e(string3)) {
                throw new IllegalArgumentException("SUBJECT_INVALID");
            }
            JSONObject jSONObjectPut = new JSONObject().put("format", "solaris-owner-keys/1").put("subjectId", string3);
            if (jSONObject2 == null || (string = jSONObject2.getString("ownerId")) == null) {
                string = "owner_" + UUID.randomUUID();
            }
            JSONObject jSONObjectPut2 = jSONObjectPut.put("ownerId", string).put("deviceId", "device_" + UUID.randomUUID()).put("databaseKey", f(this, 0, 1, null));
            if (jSONObject2 == null || (strF = jSONObject2.getString("ownerSecret")) == null) {
                strF = f(this, 0, 1, null);
            }
            JSONObject jSONObjectPut3 = jSONObjectPut2.put("ownerSecret", strF);
            if (jSONObject2 == null || (strF2 = jSONObject2.getString("receiptKey")) == null) {
                strF2 = f(this, 0, 1, null);
            }
            JSONObject jSONObjectPut4 = jSONObjectPut3.put("receiptKey", strF2);
            if (jSONObject != null) {
                JSONObject jSONObject3 = new JSONObject(jSONObject.toString());
                jSONObject3.remove("ownerCapsule");
                jSONObjectPut4.put("pendingRecovery", jSONObject3);
            }
            String string4 = jSONObjectPut4.getString("ownerId");
            J3.l.e(string4, "getString(...)");
            if (!new p027d5.o("owner_[a-f0-9-]{36}").e(string4)) {
                throw new IllegalArgumentException("OWNER_INVALID");
            }
            Iterator it = AbstractC0982q.m("databaseKey", "ownerSecret", "receiptKey").iterator();
            while (it.hasNext()) {
                String string5 = jSONObjectPut4.getString((String) it.next());
                J3.l.e(string5, "getString(...)");
                if (!new p027d5.o("[a-f0-9]{64}").e(string5)) {
                    throw new IllegalArgumentException("RECOVERY_INVALID");
                }
            }
            Cipher cipher2 = Cipher.getInstance("AES/GCM/NoPadding");
            cipher2.init(1, o());
            Charset charset = C0681d.f11148b;
            byte[] bytes2 = "solaris-native-owner/1".getBytes(charset);
            J3.l.e(bytes2, "getBytes(...)");
            cipher2.updateAAD(bytes2);
            String string6 = jSONObjectPut4.toString();
            J3.l.e(string6, "toString(...)");
            byte[] bytes3 = string6.getBytes(charset);
            J3.l.e(bytes3, "getBytes(...)");
            try {
                byte[] iv = cipher2.getIV();
                J3.l.e(iv, "getIV(...)");
                byte[] bArrDoFinal2 = cipher2.doFinal(bytes3);
                J3.l.e(bArrDoFinal2, "doFinal(...)");
                byte[] bArrR = AbstractC0975j.r(iv, bArrDoFinal2);
                AbstractC0975j.o(bytes3, (byte) 0, 0, 0, 6, null);
                FileOutputStream fileOutputStreamStartWrite = this.f1852d.startWrite();
                try {
                    fileOutputStreamStartWrite.write(bArrR);
                    this.f1852d.finishWrite(fileOutputStreamStartWrite);
                    this.f1853e = jSONObjectPut4;
                } catch (Exception e6) {
                    this.f1852d.failWrite(fileOutputStreamStartWrite);
                    throw e6;
                }
            } catch (Throwable th2) {
                AbstractC0975j.o(bytes3, (byte) 0, 0, 0, 6, null);
                throw th2;
            }
        }
        JSONObject jSONObjectC = c();
        if (this.f1854f.getBaseFile().exists() && !new File(this.f1851c, "core.db").exists()) {
            throw new IllegalStateException("VAULT_CORE_MISSING");
        }
        Pair pairA = p137u3.s.a("databaseKey", jSONObjectC.getString("databaseKey"));
        Pair pairA2 = p137u3.s.a("subjectId", jSONObjectC.getString("subjectId"));
        Pair pairA3 = p137u3.s.a("ownerId", jSONObjectC.getString("ownerId"));
        Pair pairA4 = p137u3.s.a("deviceId", jSONObjectC.getString("deviceId"));
        Pair pairA5 = p137u3.s.a("directory", this.f1851c.getAbsolutePath());
        Pair pairA6 = p137u3.s.a("hardwareSecurity", "unknown");
        Pair pairA7 = p137u3.s.a("coreInitialized", Boolean.valueOf(this.f1854f.getBaseFile().exists()));
        JSONObject jSONObjectOptJSONObject = jSONObjectC.optJSONObject("pendingRecovery");
        if (jSONObjectOptJSONObject == null || (string2 = jSONObjectOptJSONObject.toString()) == null) {
            string2 = "";
        }
        return L.l(pairA, pairA2, pairA3, pairA4, pairA5, pairA6, pairA7, p137u3.s.a("pendingRecovery", string2));
    }

    public final void m(boolean z6) throws NoSuchAlgorithmException, IOException, KeyStoreException, CertificateException, NoSuchProviderException, InvalidAlgorithmParameterException {
        if (!d() && (new File(this.f1851c, "core.db").exists() || this.f1854f.getBaseFile().exists())) {
            throw new IllegalStateException("VAULT_KEY_UNAVAILABLE");
        }
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);
        if (keyStore.containsAlias(this.f1850b)) {
            return;
        }
        if (d() || !z6) {
            throw new IllegalStateException("VAULT_KEY_UNAVAILABLE");
        }
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES", "AndroidKeyStore");
        keyGenerator.init(new KeyGenParameterSpec$Builder(this.f1850b, 3).setKeySize(IntBufferBatchMountItem.INSTRUCTION_UPDATE_EVENT_EMITTER).setBlockModes("GCM").setEncryptionPaddings("NoPadding").setUserAuthenticationRequired(true).setUserAuthenticationValidityDurationSeconds(30).build());
        keyGenerator.generateKey();
    }

    public final JSONObject n() throws JSONException {
        JSONObject jSONObjectC = c();
        JSONObject jSONObjectPut = new JSONObject().put("format", "solaris-owner-recovery/1").put("subjectId", jSONObjectC.getString("subjectId")).put("ownerId", jSONObjectC.getString("ownerId")).put("ownerSecret", jSONObjectC.getString("ownerSecret")).put("receiptKey", jSONObjectC.getString("receiptKey"));
        J3.l.e(jSONObjectPut, "put(...)");
        return jSONObjectPut;
    }
}
