package K5;

import android.app.DownloadManager;
import android.app.DownloadManager$Query;
import android.app.DownloadManager$Request;
import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.StatFs;
import android.util.AtomicFile;
import com.facebook.react.views.progressbar.ReactProgressBarViewManager;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import kotlin.Pair;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.internal.DefaultConstructorMarker;
import org.json.JSONObject;
import p027d5.C0681d;
import p137u3.n$a;
import p143v3.AbstractC0982q;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class A0 {

    /* JADX INFO: renamed from: k, reason: collision with root package name */
    public static final A0$a f1473k = new A0$a(null);

    /* JADX INFO: renamed from: l, reason: collision with root package name */
    private static A0 f1474l;

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final Context f1475a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private final SharedPreferences f1476b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private final File f1477c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    private final File f1478d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    private final File f1479e;

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    private final AtomicBoolean f1480f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    private volatile boolean f1481g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    private volatile boolean f1482h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    private volatile long f1483i;

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    private volatile String f1484j;

    public /* synthetic */ A0(Context context, DefaultConstructorMarker defaultConstructorMarker) {
        this(context);
    }

    public static /* synthetic */ p137u3.A a(A0 a6, Function1 function1, long j6) {
        return r(a6, function1, j6);
    }

    public static final /* synthetic */ A0 b() {
        return f1474l;
    }

    public static final /* synthetic */ void c(A0 a6) {
        f1474l = a6;
    }

    /* JADX WARN: Code duplicated, block: B:10:0x002c  */
    private final File e(A0$b a0$b) {
        File fileA;
        File file = this.f1478d;
        File fileL = l();
        File file2 = new File(this.f1477c, "download.partial");
        File file3 = new File(this.f1477c, "import.partial");
        Object obj = null;
        if (a0$b == null) {
            fileA = null;
        } else {
            if (a0$b.e() != 8) {
                a0$b = null;
            }
            if (a0$b != null) {
                fileA = a0$b.a();
            } else {
                fileA = null;
            }
        }
        for (Object obj2 : AbstractC0982q.o(file, fileL, file2, file3, fileA)) {
            File file4 = (File) obj2;
            if (file4.isFile() && file4.length() == 382156480) {
                obj = obj2;
                break;
            }
        }
        return (File) obj;
    }

    private final File f() {
        File externalFilesDir = this.f1475a.getExternalFilesDir("solaris-models");
        if (externalFilesDir != null) {
            return externalFilesDir;
        }
        throw new IllegalStateException("STORAGE_UNAVAILABLE");
    }

    private final DownloadManager g() {
        Object systemService = this.f1475a.getSystemService("download");
        J3.l.d(systemService, "null cannot be cast to non-null type android.app.DownloadManager");
        return (DownloadManager) systemService;
    }

    private final A0$b h() throws IOException {
        Object next;
        Object next2;
        List listI = i();
        ArrayList arrayList = new ArrayList();
        for (Object obj : listI) {
            A0$b a0$b = (A0$b) obj;
            if (a0$b.e() == 8 && a0$b.a().isFile()) {
                arrayList.add(obj);
            }
        }
        Iterator it = arrayList.iterator();
        Object obj2 = null;
        if (it.hasNext()) {
            next = it.next();
            if (it.hasNext()) {
                long jB = ((A0$b) next).b();
                do {
                    Object next3 = it.next();
                    long jB2 = ((A0$b) next3).b();
                    if (jB < jB2) {
                        next = next3;
                        jB = jB2;
                    }
                } while (it.hasNext());
            }
        } else {
            next = null;
        }
        A0$b a0$b2 = (A0$b) next;
        if (a0$b2 == null) {
            ArrayList arrayList2 = new ArrayList();
            for (Object obj3 : listI) {
                if (f1473k.a(((A0$b) obj3).e())) {
                    arrayList2.add(obj3);
                }
            }
            Iterator it2 = arrayList2.iterator();
            if (it2.hasNext()) {
                next2 = it2.next();
                if (it2.hasNext()) {
                    long jD = ((A0$b) next2).d();
                    do {
                        Object next4 = it2.next();
                        long jD2 = ((A0$b) next4).d();
                        if (jD < jD2) {
                            next2 = next4;
                            jD = jD2;
                        }
                    } while (it2.hasNext());
                }
            } else {
                next2 = null;
            }
            a0$b2 = (A0$b) next2;
            if (a0$b2 == null) {
                for (Object obj4 : listI) {
                    if (((A0$b) obj4).b() == this.f1476b.getLong("id", -1L)) {
                        obj2 = obj4;
                        break;
                    }
                }
                a0$b2 = (A0$b) obj2;
            }
        }
        if (a0$b2 != null && a0$b2.b() != this.f1476b.getLong("id", -1L)) {
            m(a0$b2.b());
        }
        return a0$b2;
    }

    private final List i() throws IOException {
        Object objA;
        String path;
        ArrayList arrayList = new ArrayList();
        Cursor cursorQuery = g().query(new DownloadManager$Query());
        if (cursorQuery == null) {
            return arrayList;
        }
        while (true) {
            try {
                Object obj = null;
                if (!cursorQuery.moveToNext()) {
                    p137u3.A a6 = p137u3.A.f16167a;
                    F3.c.a(cursorQuery, null);
                    return arrayList;
                }
                if (J3.l.b(k(cursorQuery, "uri"), "https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/50968a4468ef4233ed78cd7c3de230dd1d61a56b/Qwen3-0.6B-Q4_0.gguf")) {
                    try {
                        n$a n_a = p137u3.n.f16184f;
                        objA = p137u3.n.a(Uri.parse(k(cursorQuery, "local_uri")));
                    } catch (Throwable th) {
                        n$a n_a2 = p137u3.n.f16184f;
                        objA = p137u3.n.a(p137u3.o.a(th));
                    }
                    if (!p137u3.n.c(objA)) {
                        obj = objA;
                    }
                    Uri uri = (Uri) obj;
                    if (uri != null && J3.l.b(uri.getScheme(), "file") && (path = uri.getPath()) != null) {
                        File canonicalFile = new File(path).getCanonicalFile();
                        if (J3.l.b(canonicalFile.getParentFile(), f().getCanonicalFile())) {
                            String name = canonicalFile.getName();
                            J3.l.e(name, "getName(...)");
                            if (new p027d5.o("[a-f0-9-]{36}\\.partial").e(name)) {
                                long j6 = j(cursorQuery, "_id");
                                int iJ = (int) j(cursorQuery, "status");
                                long jD = P3.g.d(j(cursorQuery, "bytes_so_far"), 0L);
                                int iJ2 = (int) j(cursorQuery, "reason");
                                J3.l.c(canonicalFile);
                                arrayList.add(new A0$b(j6, iJ, jD, iJ2, canonicalFile));
                            }
                        }
                    }
                }
            } catch (Throwable th2) {
                throw th2;
            }
            try {
                throw th2;
            } catch (Throwable th3) {
                F3.c.a(cursorQuery, th2);
                throw th3;
            }
        }
    }

    private static final long j(Cursor cursor, String str) {
        return cursor.getLong(cursor.getColumnIndexOrThrow(str));
    }

    private static final String k(Cursor cursor, String str) {
        return cursor.getString(cursor.getColumnIndexOrThrow(str));
    }

    private final File l() {
        Object objA;
        if (!this.f1479e.isFile() || this.f1479e.length() > 4096) {
            return null;
        }
        try {
            n$a n_a = p137u3.n.f16184f;
            JSONObject jSONObject = new JSONObject(F3.j.d(this.f1479e, null, 1, null));
            if (!J3.l.b(jSONObject.optString("checksum"), "33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb")) {
                return null;
            }
            String string = jSONObject.getString("path");
            J3.l.e(string, "getString(...)");
            File canonicalFile = new File(p027d5.q.u0(string, "file://")).getCanonicalFile();
            if (J3.l.b(canonicalFile.getName(), "Qwen3-0.6B-Q4_0.gguf") && (canonicalFile.toPath().startsWith(this.f1475a.getFilesDir().getCanonicalFile().toPath()) || canonicalFile.toPath().startsWith(this.f1475a.getCacheDir().getCanonicalFile().toPath()))) {
                if (!canonicalFile.isFile() || canonicalFile.length() != 382156480) {
                    canonicalFile = null;
                }
                objA = p137u3.n.a(canonicalFile);
            }
            return null;
        } catch (Throwable th) {
            n$a n_a2 = p137u3.n.f16184f;
            objA = p137u3.n.a(p137u3.o.a(th));
        }
        return (File) (p137u3.n.c(objA) ? null : objA);
    }

    private final void m(long j6) {
        if (!this.f1476b.edit().putLong("id", j6).putString("manifest", "33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb").commit()) {
            throw new IllegalStateException("TRANSFER_STATE_FAILED");
        }
    }

    private static final p137u3.A r(A0 a6, Function1 function1, long j6) {
        a6.f1483i = j6;
        function1.q(a6.o());
        return p137u3.A.f16167a;
    }

    public final synchronized Map d(boolean z6) {
        try {
            if (this.f1481g) {
                throw new IllegalStateException("VERIFY_BUSY");
            }
            A0$b a0$bH = h();
            if (e(a0$bH) == null && (a0$bH == null || !f1473k.a(a0$bH.e()))) {
                if (new StatFs(this.f1477c.getPath()).getAvailableBytes() < 898530688) {
                    throw new IllegalStateException("INSUFFICIENT_SPACE");
                }
                if (!f().mkdirs() && !f().isDirectory()) {
                    throw new IllegalStateException("STORAGE_UNAVAILABLE");
                }
                if (new StatFs(f().getPath()).getAvailableBytes() < 516374208) {
                    throw new IllegalStateException("INSUFFICIENT_SPACE");
                }
                this.f1484j = null;
                m(g().enqueue(new DownloadManager$Request(Uri.parse("https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/50968a4468ef4233ed78cd7c3de230dd1d61a56b/Qwen3-0.6B-Q4_0.gguf")).setDestinationInExternalFilesDir(this.f1475a, "solaris-models", UUID.randomUUID() + ".partial").setTitle("Solaris · LUCA model").setDescription("Downloading your optional on-device model").setNotificationVisibility(1).setAllowedOverMetered(z6).setAllowedOverRoaming(false).setAllowedNetworkTypes(z6 ? 3 : 2)));
                return o();
            }
            return o();
        } catch (Throwable th) {
            throw th;
        }
    }

    public final synchronized Map n() {
        try {
            if (this.f1481g) {
                throw new IllegalStateException("VERIFY_BUSY");
            }
            File fileL = l();
            Iterator it = i().iterator();
            while (it.hasNext()) {
                g().remove(((A0$b) it.next()).b());
            }
            for (File file : AbstractC0982q.U(AbstractC0982q.o(this.f1478d, this.f1479e, fileL, new File(this.f1477c, "download.partial"), new File(this.f1477c, "import.partial"), new File(this.f1477c, "verified.partial")))) {
                if (file.exists() && !file.delete()) {
                    throw new IllegalStateException("MODEL_REMOVE_FAILED");
                }
            }
            if (!this.f1476b.edit().clear().commit()) {
                throw new IllegalStateException("TRANSFER_STATE_FAILED");
            }
            this.f1482h = false;
            this.f1484j = null;
        } catch (Throwable th) {
            throw th;
        }
        return o();
    }

    /* JADX WARN: Code duplicated, block: B:101:0x019e A[Catch: all -> 0x003e, TryCatch #2 {all -> 0x003e, blocks: (B:8:0x0022, B:12:0x002b, B:14:0x003b, B:17:0x0041, B:19:0x005e, B:32:0x008b, B:65:0x00e5, B:69:0x00f2, B:71:0x010c, B:72:0x0110, B:79:0x0123, B:84:0x0154, B:87:0x015b, B:89:0x0170, B:92:0x017d, B:94:0x018b, B:99:0x0198, B:101:0x019e, B:107:0x01ab, B:109:0x01b7, B:111:0x01cb, B:113:0x01d7, B:83:0x014a, B:77:0x011d, B:35:0x0095, B:38:0x009c, B:43:0x00a8, B:47:0x00b3, B:51:0x00bf, B:55:0x00ca, B:59:0x00d5, B:22:0x0066, B:23:0x006a, B:25:0x0070, B:27:0x007c, B:7:0x0017, B:4:0x000a, B:80:0x012f), top: B:118:0x000a, inners: #0, #1 }] */
    /* JADX WARN: Code duplicated, block: B:105:0x01a7  */
    /* JADX WARN: Code duplicated, block: B:107:0x01ab A[Catch: all -> 0x003e, TryCatch #2 {all -> 0x003e, blocks: (B:8:0x0022, B:12:0x002b, B:14:0x003b, B:17:0x0041, B:19:0x005e, B:32:0x008b, B:65:0x00e5, B:69:0x00f2, B:71:0x010c, B:72:0x0110, B:79:0x0123, B:84:0x0154, B:87:0x015b, B:89:0x0170, B:92:0x017d, B:94:0x018b, B:99:0x0198, B:101:0x019e, B:107:0x01ab, B:109:0x01b7, B:111:0x01cb, B:113:0x01d7, B:83:0x014a, B:77:0x011d, B:35:0x0095, B:38:0x009c, B:43:0x00a8, B:47:0x00b3, B:51:0x00bf, B:55:0x00ca, B:59:0x00d5, B:22:0x0066, B:23:0x006a, B:25:0x0070, B:27:0x007c, B:7:0x0017, B:4:0x000a, B:80:0x012f), top: B:118:0x000a, inners: #0, #1 }] */
    /* JADX WARN: Code duplicated, block: B:108:0x01b6  */
    /* JADX WARN: Code duplicated, block: B:111:0x01cb A[Catch: all -> 0x003e, TryCatch #2 {all -> 0x003e, blocks: (B:8:0x0022, B:12:0x002b, B:14:0x003b, B:17:0x0041, B:19:0x005e, B:32:0x008b, B:65:0x00e5, B:69:0x00f2, B:71:0x010c, B:72:0x0110, B:79:0x0123, B:84:0x0154, B:87:0x015b, B:89:0x0170, B:92:0x017d, B:94:0x018b, B:99:0x0198, B:101:0x019e, B:107:0x01ab, B:109:0x01b7, B:111:0x01cb, B:113:0x01d7, B:83:0x014a, B:77:0x011d, B:35:0x0095, B:38:0x009c, B:43:0x00a8, B:47:0x00b3, B:51:0x00bf, B:55:0x00ca, B:59:0x00d5, B:22:0x0066, B:23:0x006a, B:25:0x0070, B:27:0x007c, B:7:0x0017, B:4:0x000a, B:80:0x012f), top: B:118:0x000a, inners: #0, #1 }] */
    /* JADX WARN: Code duplicated, block: B:112:0x01d6  */
    /* JADX WARN: Code duplicated, block: B:86:0x015a  */
    /* JADX WARN: Code duplicated, block: B:94:0x018b A[Catch: all -> 0x003e, TryCatch #2 {all -> 0x003e, blocks: (B:8:0x0022, B:12:0x002b, B:14:0x003b, B:17:0x0041, B:19:0x005e, B:32:0x008b, B:65:0x00e5, B:69:0x00f2, B:71:0x010c, B:72:0x0110, B:79:0x0123, B:84:0x0154, B:87:0x015b, B:89:0x0170, B:92:0x017d, B:94:0x018b, B:99:0x0198, B:101:0x019e, B:107:0x01ab, B:109:0x01b7, B:111:0x01cb, B:113:0x01d7, B:83:0x014a, B:77:0x011d, B:35:0x0095, B:38:0x009c, B:43:0x00a8, B:47:0x00b3, B:51:0x00bf, B:55:0x00ca, B:59:0x00d5, B:22:0x0066, B:23:0x006a, B:25:0x0070, B:27:0x007c, B:7:0x0017, B:4:0x000a, B:80:0x012f), top: B:118:0x000a, inners: #0, #1 }] */
    /* JADX WARN: Code duplicated, block: B:98:0x0196  */
    /* JADX WARN: Code duplicated, block: B:99:0x0198 A[Catch: all -> 0x003e, TryCatch #2 {all -> 0x003e, blocks: (B:8:0x0022, B:12:0x002b, B:14:0x003b, B:17:0x0041, B:19:0x005e, B:32:0x008b, B:65:0x00e5, B:69:0x00f2, B:71:0x010c, B:72:0x0110, B:79:0x0123, B:84:0x0154, B:87:0x015b, B:89:0x0170, B:92:0x017d, B:94:0x018b, B:99:0x0198, B:101:0x019e, B:107:0x01ab, B:109:0x01b7, B:111:0x01cb, B:113:0x01d7, B:83:0x014a, B:77:0x011d, B:35:0x0095, B:38:0x009c, B:43:0x00a8, B:47:0x00b3, B:51:0x00bf, B:55:0x00ca, B:59:0x00d5, B:22:0x0066, B:23:0x006a, B:25:0x0070, B:27:0x007c, B:7:0x0017, B:4:0x000a, B:80:0x012f), top: B:118:0x000a, inners: #0, #1 }] */
    public final synchronized Map o() {
        Object objA;
        boolean z6;
        String str;
        Pair pairA;
        Pair pairA2;
        Pair pairA3;
        A0$b a0$b;
        Long lValueOf;
        long jD;
        Pair pairA4;
        Pair pairA5;
        Object objA2;
        Pair pairA6;
        Pair pairA7;
        Pair pairA8;
        String strC;
        Pair pairA9;
        Pair pairA10;
        String string;
        A0$b a0$b2;
        try {
            try {
                n$a n_a = p137u3.n.f16184f;
                objA = p137u3.n.a(h());
            } catch (Throwable th) {
                n$a n_a2 = p137u3.n.f16184f;
                objA = p137u3.n.a(p137u3.o.a(th));
            }
            Object obj = objA;
            A0$b a0$b3 = (A0$b) (p137u3.n.c(obj) ? null : obj);
            File fileE = e(a0$b3);
            boolean z7 = false;
            if (!this.f1478d.isFile()) {
                this.f1482h = false;
            }
            List listM = AbstractC0982q.m(new File(this.f1477c, "download.partial"), new File(this.f1477c, "import.partial"));
            if (listM != null && listM.isEmpty()) {
                z6 = false;
                break;
            }
            Iterator it = listM.iterator();
            while (true) {
                if (!it.hasNext()) {
                    z6 = false;
                    break;
                }
                File file = (File) it.next();
                if (file.isFile()) {
                    long length = file.length();
                    if (1 <= length && length < 382156480) {
                        z6 = true;
                        break;
                    }
                }
            }
            if (this.f1481g) {
                str = "verifying";
            } else if (this.f1482h) {
                str = "ready";
            } else if (this.f1484j != null) {
                str = "failed";
            } else if (fileE != null) {
                str = "downloaded";
            } else if (p137u3.n.c(obj)) {
                str = "failed";
            } else if (a0$b3 != null && a0$b3.e() == 2) {
                str = "downloading";
            } else if (a0$b3 != null && a0$b3.e() == 1) {
                str = "queued";
            } else if (a0$b3 != null && a0$b3.e() == 4) {
                str = "waiting";
            } else if (a0$b3 == null || a0$b3.e() != 16) {
                str = z6 ? "legacy-partial" : "not-installed";
            } else {
                str = "failed";
            }
            pairA = p137u3.s.a("state", str);
            pairA2 = p137u3.s.a("cached", Boolean.valueOf(fileE != null));
            pairA3 = p137u3.s.a("verified", Boolean.valueOf(this.f1482h));
            try {
                if (this.f1481g) {
                    a0$b = a0$b3;
                    jD = this.f1483i;
                } else {
                    a0$b = a0$b3;
                    if (fileE != null) {
                        lValueOf = 382156480L;
                    } else if (a0$b != null) {
                        jD = a0$b.d();
                    } else {
                        lValueOf = null;
                    }
                    pairA4 = p137u3.s.a("receivedBytes", lValueOf);
                    pairA5 = p137u3.s.a("totalBytes", 382156480L);
                    n$a n_a3 = p137u3.n.f16184f;
                    objA2 = p137u3.n.a(Long.valueOf(new StatFs(this.f1477c.getPath()).getAvailableBytes()));
                    if (p137u3.n.c(objA2)) {
                        objA2 = null;
                    }
                    pairA6 = p137u3.s.a("freeBytes", objA2);
                    pairA7 = p137u3.s.a("requiredFreeBytes", 898530688L);
                    if (a0$b != null && f1473k.a(a0$b.e())) {
                        z7 = true;
                    }
                    pairA8 = p137u3.s.a("backgroundOwned", Boolean.valueOf(z7));
                    strC = this.f1484j;
                    if (strC == null) {
                        if (!p137u3.n.c(obj) && fileE == null) {
                            strC = "DOWNLOAD_SERVICE_UNAVAILABLE";
                        } else if (a0$b == null) {
                            strC = null;
                        } else {
                            if (a0$b.e() != 4 || a0$b.e() == 16) {
                                a0$b2 = a0$b;
                            } else {
                                a0$b2 = null;
                            }
                            if (a0$b2 != null) {
                                strC = f1473k.c(a0$b2.c());
                            } else {
                                strC = null;
                            }
                        }
                    }
                    pairA9 = p137u3.s.a("reason", strC);
                    pairA10 = p137u3.s.a("legacyPartial", Boolean.valueOf(z6));
                    if (this.f1482h) {
                        string = Uri.fromFile(this.f1478d).toString();
                    } else {
                        string = null;
                    }
                }
                n$a n_a4 = p137u3.n.f16184f;
                objA2 = p137u3.n.a(Long.valueOf(new StatFs(this.f1477c.getPath()).getAvailableBytes()));
            } catch (Throwable th2) {
                n$a n_a5 = p137u3.n.f16184f;
                objA2 = p137u3.n.a(p137u3.o.a(th2));
            }
            lValueOf = Long.valueOf(jD);
            pairA4 = p137u3.s.a("receivedBytes", lValueOf);
            pairA5 = p137u3.s.a("totalBytes", 382156480L);
            if (p137u3.n.c(objA2)) {
                objA2 = null;
            }
            pairA6 = p137u3.s.a("freeBytes", objA2);
            pairA7 = p137u3.s.a("requiredFreeBytes", 898530688L);
            if (a0$b != null) {
                z7 = true;
            }
            pairA8 = p137u3.s.a("backgroundOwned", Boolean.valueOf(z7));
            strC = this.f1484j;
            if (strC == null) {
                if (!p137u3.n.c(obj)) {
                    if (a0$b == null) {
                        strC = null;
                    } else {
                        if (a0$b.e() != 4) {
                            a0$b2 = a0$b;
                        } else {
                            a0$b2 = a0$b;
                        }
                        if (a0$b2 != null) {
                            strC = f1473k.c(a0$b2.c());
                        } else {
                            strC = null;
                        }
                    }
                } else if (a0$b == null) {
                    strC = null;
                } else {
                    if (a0$b.e() != 4) {
                        a0$b2 = a0$b;
                    } else {
                        a0$b2 = a0$b;
                    }
                    if (a0$b2 != null) {
                        strC = f1473k.c(a0$b2.c());
                    } else {
                        strC = null;
                    }
                }
            }
            pairA9 = p137u3.s.a("reason", strC);
            pairA10 = p137u3.s.a("legacyPartial", Boolean.valueOf(z6));
            if (this.f1482h) {
                string = Uri.fromFile(this.f1478d).toString();
            } else {
                string = null;
            }
        } catch (Throwable th3) {
            throw th3;
        }
        return p143v3.L.l(pairA, pairA2, pairA3, pairA4, pairA5, pairA6, pairA7, pairA8, pairA9, pairA10, p137u3.s.a("path", string));
    }

    public final synchronized Map p() {
        try {
            this.f1480f.set(true);
            List listI = i();
            ArrayList arrayList = new ArrayList();
            for (Object obj : listI) {
                if (f1473k.a(((A0$b) obj).e())) {
                    arrayList.add(obj);
                }
            }
            Iterator it = arrayList.iterator();
            while (it.hasNext()) {
                g().remove(((A0$b) it.next()).b());
            }
            this.f1484j = null;
        } catch (Throwable th) {
            throw th;
        }
        return o();
    }

    public final Map q(Function1 function1) {
        Object objA;
        File fileE;
        J3.l.f(function1, ReactProgressBarViewManager.PROP_PROGRESS);
        synchronized (this) {
            if (this.f1481g) {
                throw new IllegalStateException("VERIFY_BUSY");
            }
            try {
                n$a n_a = p137u3.n.f16184f;
                objA = p137u3.n.a(h());
            } catch (Throwable th) {
                n$a n_a2 = p137u3.n.f16184f;
                objA = p137u3.n.a(p137u3.o.a(th));
            }
            if (p137u3.n.c(objA)) {
                objA = null;
            }
            fileE = e((A0$b) objA);
            if (fileE == null) {
                throw new IllegalStateException("MODEL_NOT_DOWNLOADED");
            }
            this.f1481g = true;
            this.f1482h = false;
            this.f1480f.set(false);
            this.f1483i = 0L;
            this.f1484j = null;
            p137u3.A a6 = p137u3.A.f16167a;
        }
        File file = J3.l.b(fileE.getCanonicalFile(), this.f1478d.getCanonicalFile()) ? null : new File(this.f1477c, "verified.partial");
        try {
            if (file != null) {
                try {
                    if (new StatFs(this.f1477c.getPath()).getAvailableBytes() < 449265344) {
                        throw new IllegalStateException("INSUFFICIENT_SPACE");
                    }
                } catch (Exception e6) {
                    synchronized (this) {
                        try {
                            this.f1484j = AbstractC0982q.T(p143v3.U.h("CANCELLED", "MODEL_SIZE_MISMATCH", "MODEL_INTEGRITY_FAILED", "INSUFFICIENT_SPACE"), e6.getMessage()) ? e6.getMessage() : "MODEL_VERIFY_FAILED";
                            p137u3.A a7 = p137u3.A.f16167a;
                            if (file == null) {
                                throw e6;
                            }
                            file.delete();
                            throw e6;
                        } catch (Throwable th2) {
                            throw th2;
                        }
                    }
                }
            }
            C0.f1490a.b(fileE, file, 382156480L, "33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb", this.f1480f, new z0(this, function1));
            synchronized (this) {
                try {
                    if (this.f1480f.get()) {
                        throw new IllegalStateException("CANCELLED");
                    }
                    if (file != null) {
                        Files.move(file.toPath(), this.f1478d.toPath(), StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
                    }
                    AtomicFile atomicFile = new AtomicFile(this.f1479e);
                    FileOutputStream fileOutputStreamStartWrite = atomicFile.startWrite();
                    try {
                        String string = new JSONObject().put("path", Uri.fromFile(this.f1478d).toString()).put("checksum", "33bcc57074ec7b6eada5a90651ee546ec0c2b271002c22baf9f1b2dd1e8f75cb").toString();
                        J3.l.e(string, "toString(...)");
                        byte[] bytes = string.getBytes(C0681d.f11148b);
                        J3.l.e(bytes, "getBytes(...)");
                        fileOutputStreamStartWrite.write(bytes);
                        atomicFile.finishWrite(fileOutputStreamStartWrite);
                        this.f1482h = true;
                        try {
                            Iterator it = i().iterator();
                            while (it.hasNext()) {
                                g().remove(((A0$b) it.next()).b());
                            }
                            p137u3.n.a(p137u3.A.f16167a);
                        } catch (Throwable th3) {
                            n$a n_a3 = p137u3.n.f16184f;
                            p137u3.n.a(p137u3.o.a(th3));
                        }
                        if (!J3.l.b(fileE.getCanonicalFile(), this.f1478d.getCanonicalFile())) {
                            fileE.delete();
                        }
                        p137u3.A a8 = p137u3.A.f16167a;
                    } catch (Exception e7) {
                        atomicFile.failWrite(fileOutputStreamStartWrite);
                        throw e7;
                    }
                } catch (Throwable th4) {
                    throw th4;
                }
            }
            synchronized (this) {
                this.f1481g = false;
            }
            return o();
        } catch (Throwable th5) {
            synchronized (this) {
                this.f1481g = false;
                p137u3.A a9 = p137u3.A.f16167a;
                throw th5;
            }
        }
    }

    private A0(Context context) {
        this.f1475a = context;
        this.f1476b = context.getSharedPreferences("solaris-model-transfer-v2", 0);
        File file = new File(context.getFilesDir(), "solaris-qvac-models");
        file.mkdirs();
        this.f1477c = file;
        this.f1478d = new File(file, "Qwen3-0.6B-Q4_0.gguf");
        this.f1479e = new File(context.getFilesDir(), "solaris-qvac-download.json");
        this.f1480f = new AtomicBoolean(false);
    }
}
