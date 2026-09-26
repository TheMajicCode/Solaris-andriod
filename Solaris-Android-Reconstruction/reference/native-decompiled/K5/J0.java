package K5;

import android.app.ActivityManager;
import android.app.ApplicationExitInfo;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences$Editor;
import android.os.Build$VERSION;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import kotlin.Pair;
import kotlin.jvm.internal.DefaultConstructorMarker;
import p137u3.n$a;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class J0 {

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    private static J0 f1492i;

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final Context f1495a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private final SharedPreferences f1496b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private final String f1497c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    private final String f1498d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    private final Pair f1499e;

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    private final Integer f1500f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    private boolean f1501g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public static final J0$a f1491h = new J0$a(null);

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    private static final Set f1493j = p143v3.U.h("bare-init", "bare-start", "bare-echo", "sdk-bootstrap", "sdk-heartbeat", "model-load", "model-ready", "stream", "stream-complete", "unload", "idle");

    /* JADX INFO: renamed from: k, reason: collision with root package name */
    private static final Set f1494k = p143v3.U.h("bare-init", "bare-start", "sdk-bootstrap", "sdk-heartbeat", "model-load", "stream", "unload");

    public /* synthetic */ J0(Context context, DefaultConstructorMarker defaultConstructorMarker) {
        this(context);
    }

    public static final /* synthetic */ J0 a() {
        return f1492i;
    }

    public static final /* synthetic */ void b(J0 j6) {
        f1492i = j6;
    }

    public final synchronized void c() {
        this.f1501g = false;
        if (!this.f1496b.edit().putBoolean("blocked", false).putBoolean("armed", false).remove("phase").commit()) {
            throw new IllegalStateException("RECOVERY_STATE_FAILED");
        }
    }

    public final synchronized void d(String str) {
        try {
            J3.l.f(str, "phase");
            if (!f1493j.contains(str)) {
                throw new IllegalArgumentException("STAGE_INVALID");
            }
            if (this.f1501g) {
                throw new IllegalStateException("WORKER_RECOVERY_REQUIRED");
            }
            SharedPreferences$Editor sharedPreferences$EditorPutString = this.f1496b.edit().putString("phase", str);
            Set set = f1494k;
            SharedPreferences$Editor sharedPreferences$EditorPutBoolean = sharedPreferences$EditorPutString.putBoolean("armed", set.contains(str));
            if (set.contains(str) && !this.f1496b.getBoolean("armed", false)) {
                sharedPreferences$EditorPutBoolean.putLong("armedAt", System.currentTimeMillis());
            }
            if (!sharedPreferences$EditorPutBoolean.commit()) {
                throw new IllegalStateException("RECOVERY_STATE_FAILED");
            }
        } catch (Throwable th) {
            throw th;
        }
    }

    public final synchronized Map e() {
        Pair pairA;
        Pair pairA2;
        Pair pairA3;
        Pair pairA4;
        int i6;
        try {
            pairA = p137u3.s.a("runId", this.f1497c);
            pairA2 = p137u3.s.a("previousStage", this.f1498d);
            pairA3 = p137u3.s.a("exitReason", f1491h.c(this.f1500f));
            Pair pair = this.f1499e;
            pairA4 = p137u3.s.a("exitStatus", pair != null ? (Integer) pair.d() : null);
            i6 = Build$VERSION.SDK_INT;
        } catch (Throwable th) {
            throw th;
        }
        return p143v3.L.l(pairA, pairA2, pairA3, pairA4, p137u3.s.a("exitReasonAvailable", Boolean.valueOf(i6 >= 30 && this.f1500f != null)), p137u3.s.a("blocked", Boolean.valueOf(this.f1501g)), p137u3.s.a("currentStage", this.f1496b.getString("phase", null)), p137u3.s.a("apiSupported", Boolean.valueOf(i6 >= 30)));
    }

    /* JADX WARN: Code duplicated, block: B:44:0x00f3  */
    private J0(Context context) {
        Object objA;
        Pair pair;
        Object next;
        boolean z6;
        this.f1495a = context;
        SharedPreferences sharedPreferences = context.getSharedPreferences("solaris-runtime-recovery-v2", 0);
        this.f1496b = sharedPreferences;
        String string = UUID.randomUUID().toString();
        J3.l.e(string, "toString(...)");
        this.f1497c = string;
        String string2 = sharedPreferences.getString("phase", null);
        this.f1498d = (string2 == null || !f1493j.contains(string2)) ? null : string2;
        if (Build$VERSION.SDK_INT >= 30) {
            try {
                n$a n_a = p137u3.n.f16184f;
                Object systemService = context.getSystemService("activity");
                J3.l.d(systemService, "null cannot be cast to non-null type android.app.ActivityManager");
                List listA = D0.a((ActivityManager) systemService, context.getPackageName(), 0, 8);
                J3.l.e(listA, "getHistoricalProcessExitReasons(...)");
                Iterator it = listA.iterator();
                while (true) {
                    if (!it.hasNext()) {
                        next = null;
                        break;
                    }
                    next = it.next();
                    ApplicationExitInfo applicationExitInfoA = E0.a(next);
                    if (J3.l.b(F0.a(applicationExitInfoA), this.f1495a.getPackageName()) && G0.a(applicationExitInfoA) >= this.f1496b.getLong("armedAt", 0L)) {
                        break;
                    }
                }
                ApplicationExitInfo applicationExitInfoA2 = E0.a(next);
                objA = p137u3.n.a(applicationExitInfoA2 != null ? p137u3.s.a(Integer.valueOf(H0.a(applicationExitInfoA2)), Integer.valueOf(I0.a(applicationExitInfoA2))) : null);
            } catch (Throwable th) {
                n$a n_a2 = p137u3.n.f16184f;
                objA = p137u3.n.a(p137u3.o.a(th));
            }
            pair = (Pair) (p137u3.n.c(objA) ? null : objA);
        } else {
            pair = null;
        }
        this.f1499e = pair;
        Integer num = pair != null ? (Integer) pair.c() : null;
        this.f1500f = num;
        if (!this.f1496b.getBoolean("blocked", false)) {
            z6 = f1491h.b(this.f1496b.getBoolean("armed", false), this.f1498d != null, num);
        }
        this.f1501g = z6;
        if (!this.f1496b.edit().putBoolean("blocked", this.f1501g).commit()) {
            throw new IllegalStateException("RECOVERY_STATE_FAILED");
        }
    }
}
