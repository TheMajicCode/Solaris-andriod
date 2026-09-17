package L5;

import J3.B;
import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.hardware.biometrics.BiometricManager;
import android.hardware.biometrics.BiometricPrompt$Builder;
import android.os.Build$VERSION;
import android.os.CancellationSignal;
import android.security.keystore.UserNotAuthenticatedException;
import com.facebook.react.bridge.BaseJavaModule;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import kotlin.Lazy;
import kotlin.Metadata;
import kotlin.Pair;
import org.json.JSONObject;
import p095n3.C0888b;
import p095n3.C0891d;
import p095n3.I;
import p095n3.P;
import p095n3.Q;
import p095n3.T;
import p137u3.A;
import p143v3.AbstractC0975j;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
@Metadata(d1 = {"\u0000\u0090\u0001\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0004\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\t\n\u0002\b\b\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\r\n\u0002\u0018\u0002\n\u0002\b\t\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0010\u0012\n\u0002\b\u0003\n\u0002\u0010\u0019\n\u0002\b\u000b\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0004\u0018\u00002\u00020\u0001B\u0007¢\u0006\u0004\b\u0002\u0010\u0003J\u000f\u0010\u0005\u001a\u00020\u0004H\u0002¢\u0006\u0004\b\u0005\u0010\u0003J\u0019\u0010\b\u001a\u00020\u00042\b\b\u0002\u0010\u0007\u001a\u00020\u0006H\u0002¢\u0006\u0004\b\b\u0010\tJ\u000f\u0010\n\u001a\u00020\u0004H\u0002¢\u0006\u0004\b\n\u0010\u0003J\u0019\u0010\r\u001a\u00020\u00042\b\u0010\f\u001a\u0004\u0018\u00010\u000bH\u0002¢\u0006\u0004\b\r\u0010\u000eJ\u0017\u0010\u0012\u001a\u00020\u00112\u0006\u0010\u0010\u001a\u00020\u000fH\u0002¢\u0006\u0004\b\u0012\u0010\u0013J\u001f\u0010\u0016\u001a\u00020\u00042\u000e\u0010\u0015\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u000b0\u0014H\u0002¢\u0006\u0004\b\u0016\u0010\u0017J\u0017\u0010\u001a\u001a\u00020\u00042\u0006\u0010\u0019\u001a\u00020\u0018H\u0002¢\u0006\u0004\b\u001a\u0010\u001bJ\u001f\u0010\u001d\u001a\u00020\u00042\u0006\u0010\u0019\u001a\u00020\u00182\u0006\u0010\u001c\u001a\u00020\u0011H\u0002¢\u0006\u0004\b\u001d\u0010\u001eJ+\u0010#\u001a\u00020\u00042\u0006\u0010\u001f\u001a\u00020\u00112\u0006\u0010 \u001a\u00020\u00062\n\b\u0002\u0010\"\u001a\u0004\u0018\u00010!H\u0002¢\u0006\u0004\b#\u0010$J\u000f\u0010&\u001a\u00020%H\u0016¢\u0006\u0004\b&\u0010'R\u001b\u0010,\u001a\u00020(8BX\u0082\u0084\u0002¢\u0006\f\n\u0004\b&\u0010)\u001a\u0004\b*\u0010+R\u001c\u00101\u001a\n .*\u0004\u0018\u00010-0-8\u0002X\u0082\u0004¢\u0006\u0006\n\u0004\b/\u00100R\u0018\u00104\u001a\u0004\u0018\u00010\u000f8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\b2\u00103R\u001e\u00107\u001a\n\u0012\u0004\u0012\u00020\u000b\u0018\u00010\u00148\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\b5\u00106R\u0016\u0010:\u001a\u00020\u00188\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\b8\u00109R\u0018\u0010>\u001a\u0004\u0018\u00010;8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\b<\u0010=R\u0018\u0010A\u001a\u0004\u0018\u00010\u00188\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\b?\u0010@R\u0016\u0010D\u001a\u00020\u00118\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\bB\u0010CR\u0016\u0010H\u001a\u00020E8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\bF\u0010GR\u0018\u0010L\u001a\u0004\u0018\u00010I8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\bJ\u0010KR\u0018\u0010P\u001a\u0004\u0018\u00010M8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\bN\u0010OR\u0018\u0010R\u001a\u0004\u0018\u00010I8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\bQ\u0010KR\u0018\u0010T\u001a\u0004\u0018\u00010!8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\b\u0010\u0010SR\u0016\u0010V\u001a\u00020E8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\bU\u0010GR\u0016\u0010X\u001a\u00020E8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\bW\u0010GR\u0018\u0010\\\u001a\u0004\u0018\u00010Y8\u0002@\u0002X\u0082\u000e¢\u0006\u0006\n\u0004\bZ\u0010[R\u0014\u0010`\u001a\u00020]8BX\u0082\u0004¢\u0006\u0006\u001a\u0004\b^\u0010_¨\u0006a"}, d2 = {"LL5/m;", "Lh3/c;", "<init>", "()V", "Lu3/A;", "e0", "", "code", "i0", "(Ljava/lang/String;)V", "f0", "", "value", "k0", "(Ljava/lang/Object;)V", "LW2/s;", "p", "", "d0", "(LW2/s;)Z", "Lkotlin/Function0;", "work", "b0", "(LI3/a;)V", "", "ticket", "g0", "(J)V", "usedCredential", "o0", "(JZ)V", "create", "subject", "Lorg/json/JSONObject;", "recovery", "X", "(ZLjava/lang/String;Lorg/json/JSONObject;)V", "Lh3/e;", "d", "()Lh3/e;", "LL5/s;", "Lkotlin/Lazy;", "m0", "()LL5/s;", "keys", "Ljava/util/concurrent/ExecutorService;", "kotlin.jvm.PlatformType", "e", "Ljava/util/concurrent/ExecutorService;", "executor", "f", "LW2/s;", BaseJavaModule.METHOD_TYPE_PROMISE, "g", "LI3/a;", "nextUnlock", "h", "J", "authEpoch", "Landroid/os/CancellationSignal;", "i", "Landroid/os/CancellationSignal;", "authSignal", "j", "Ljava/lang/Long;", "credentialEpoch", "k", "Z", "authPending", "", "l", "I", "credentialRequestCode", "", "m", "[B", "exportBytes", "", "n", "[C", "exportPass", "o", "exportDigest", "Lorg/json/JSONObject;", "restored", "q", "attachmentRequestCode", "r", "attachmentSequence", "LL5/p$a;", "s", "LL5/p$a;", "attachmentRequest", "Landroid/content/Context;", "l0", "()Landroid/content/Context;", "context", "solaris-vault_release"}, k = 1, mv = {2, 1, 0}, xi = 48)
public final class m extends p053h3.c {

    /* JADX INFO: renamed from: f, reason: collision with root package name and from kotlin metadata */
    private W2.s promise;

    /* JADX INFO: renamed from: g, reason: collision with root package name and from kotlin metadata */
    private I3.a nextUnlock;

    /* JADX INFO: renamed from: h, reason: collision with root package name and from kotlin metadata */
    private volatile long authEpoch;

    /* JADX INFO: renamed from: i, reason: collision with root package name and from kotlin metadata */
    private CancellationSignal authSignal;

    /* JADX INFO: renamed from: j, reason: collision with root package name and from kotlin metadata */
    private Long credentialEpoch;

    /* JADX INFO: renamed from: k, reason: collision with root package name and from kotlin metadata */
    private volatile boolean authPending;

    /* JADX INFO: renamed from: m, reason: collision with root package name and from kotlin metadata */
    private byte[] exportBytes;

    /* JADX INFO: renamed from: n, reason: collision with root package name and from kotlin metadata */
    private char[] exportPass;

    /* JADX INFO: renamed from: o, reason: collision with root package name and from kotlin metadata */
    private byte[] exportDigest;

    /* JADX INFO: renamed from: p, reason: collision with root package name and from kotlin metadata */
    private JSONObject restored;

    /* JADX INFO: renamed from: r, reason: collision with root package name and from kotlin metadata */
    private int attachmentSequence;

    /* JADX INFO: renamed from: s, reason: collision with root package name and from kotlin metadata */
    private volatile p$a attachmentRequest;

    /* JADX INFO: renamed from: d, reason: collision with root package name and from kotlin metadata */
    private final Lazy keys = p137u3.h.a(new f(this));

    /* JADX INFO: renamed from: e, reason: collision with root package name and from kotlin metadata */
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    /* JADX INFO: renamed from: l, reason: collision with root package name and from kotlin metadata */
    private int credentialRequestCode = -1;

    /* JADX INFO: renamed from: q, reason: collision with root package name and from kotlin metadata */
    private int attachmentRequestCode = -1;

    public static final /* synthetic */ int A(m mVar) {
        return mVar.attachmentRequestCode;
    }

    public static final /* synthetic */ int B(m mVar) {
        return mVar.attachmentSequence;
    }

    public static final /* synthetic */ long C(m mVar) {
        return mVar.authEpoch;
    }

    public static final /* synthetic */ boolean D(m mVar) {
        return mVar.authPending;
    }

    public static final /* synthetic */ Context E(m mVar) {
        return mVar.l0();
    }

    public static final /* synthetic */ Long F(m mVar) {
        return mVar.credentialEpoch;
    }

    public static final /* synthetic */ int G(m mVar) {
        return mVar.credentialRequestCode;
    }

    public static final /* synthetic */ ExecutorService H(m mVar) {
        return mVar.executor;
    }

    public static final /* synthetic */ byte[] I(m mVar) {
        return mVar.exportBytes;
    }

    public static final /* synthetic */ byte[] J(m mVar) {
        return mVar.exportDigest;
    }

    public static final /* synthetic */ char[] K(m mVar) {
        return mVar.exportPass;
    }

    public static final /* synthetic */ s L(m mVar) {
        return mVar.m0();
    }

    public static final /* synthetic */ W2.s M(m mVar) {
        return mVar.promise;
    }

    public static final /* synthetic */ JSONObject N(m mVar) {
        return mVar.restored;
    }

    public static final /* synthetic */ void O(m mVar, long j6, boolean z6) {
        mVar.o0(j6, z6);
    }

    public static final /* synthetic */ void P(m mVar, p$a p_a) {
        mVar.attachmentRequest = p_a;
    }

    public static final /* synthetic */ void Q(m mVar, int i6) {
        mVar.attachmentRequestCode = i6;
    }

    public static final /* synthetic */ void R(m mVar, int i6) {
        mVar.attachmentSequence = i6;
    }

    public static final /* synthetic */ void S(m mVar, Long l6) {
        mVar.credentialEpoch = l6;
    }

    public static final /* synthetic */ void T(m mVar, byte[] bArr) {
        mVar.exportBytes = bArr;
    }

    public static final /* synthetic */ void U(m mVar, byte[] bArr) {
        mVar.exportDigest = bArr;
    }

    public static final /* synthetic */ void V(m mVar, char[] cArr) {
        mVar.exportPass = cArr;
    }

    public static final /* synthetic */ void W(m mVar, JSONObject jSONObject) {
        mVar.restored = jSONObject;
    }

    private final void X(boolean create, String subject, JSONObject recovery) {
        Activity activityA = a().a();
        if (activityA == null) {
            i0("VAULT_UNAVAILABLE");
            return;
        }
        this.authEpoch++;
        long j6 = this.authEpoch;
        this.authPending = true;
        activityA.runOnUiThread(new i(j6, this, activityA, create, subject, recovery));
    }

    static /* synthetic */ void Y(m mVar, boolean z6, String str, JSONObject jSONObject, int i6, Object obj) {
        if ((i6 & 4) != 0) {
            jSONObject = null;
        }
        mVar.X(z6, str, jSONObject);
    }

    private static final void Z(long j6, m mVar, Activity activity, boolean z6, String str, JSONObject jSONObject) {
        try {
            if (j6 == mVar.authEpoch && mVar.promise != null) {
                Object systemService = activity.getSystemService("keyguard");
                J3.l.d(systemService, "null cannot be cast to non-null type android.app.KeyguardManager");
                if (!((KeyguardManager) systemService).isDeviceSecure()) {
                    mVar.i0("DEVICE_LOCK_REQUIRED");
                    return;
                }
                mVar.m0().m(z6);
                mVar.nextUnlock = new k(mVar, z6, str, jSONObject);
                if (Build$VERSION.SDK_INT < 30 || d.a((BiometricManager) activity.getSystemService(BiometricManager.class), 32783) != 0) {
                    mVar.g0(j6);
                    return;
                }
                CancellationSignal cancellationSignal = new CancellationSignal();
                mVar.authSignal = cancellationSignal;
                e.a(new BiometricPrompt$Builder(activity).setTitle("Unlock your Solaris Vault").setSubtitle("Use your fingerprint, supported face unlock, or phone screen lock."), 32783).setConfirmationRequired(false).build().authenticate(cancellationSignal, activity.getMainExecutor(), new C0110m$a(j6, mVar));
            }
        } catch (Exception unused) {
            if (j6 == mVar.authEpoch) {
                mVar.i0("VAULT_KEY_UNAVAILABLE");
            }
        }
    }

    private static final Map a0(m mVar, boolean z6, String str, JSONObject jSONObject) {
        return mVar.m0().l(z6, str, jSONObject);
    }

    private final void b0(I3.a work) {
        this.executor.execute(new h(this, work));
    }

    private static final void c0(m mVar, I3.a aVar) {
        try {
            mVar.k0(aVar.invoke());
        } catch (Exception unused) {
            j0(mVar, null, 1, null);
        }
    }

    private final boolean d0(W2.s p6) {
        if (this.promise != null) {
            p6.reject("VAULT_BUSY", "VAULT_BUSY", null);
            return false;
        }
        this.promise = p6;
        return true;
    }

    private final void e0() {
        this.authEpoch++;
        this.authPending = false;
        this.credentialEpoch = null;
        this.credentialRequestCode = -1;
        CancellationSignal cancellationSignal = this.authSignal;
        this.authSignal = null;
        if (cancellationSignal != null) {
            cancellationSignal.cancel();
        }
    }

    private final void f0() {
        e0();
        p$a p_a = this.attachmentRequest;
        if (p_a != null) {
            p_a.b();
        }
        this.attachmentRequest = null;
        this.attachmentRequestCode = -1;
        this.promise = null;
        this.nextUnlock = null;
        byte[] bArr = this.exportBytes;
        if (bArr != null) {
            AbstractC0975j.o(bArr, (byte) 0, 0, 0, 6, null);
        }
        this.exportBytes = null;
        char[] cArr = this.exportPass;
        if (cArr != null) {
            AbstractC0975j.p(cArr, (char) 0, 0, 0, 6, null);
        }
        this.exportPass = null;
        this.exportDigest = null;
    }

    private final void g0(long ticket) {
        Activity activityA = a().a();
        if (activityA == null) {
            i0("VAULT_UNAVAILABLE");
        } else {
            activityA.runOnUiThread(new l(ticket, this, activityA));
        }
    }

    private static final void h0(long j6, m mVar, Activity activity) {
        if (j6 != mVar.authEpoch || mVar.promise == null) {
            return;
        }
        try {
            Object systemService = activity.getSystemService("keyguard");
            J3.l.d(systemService, "null cannot be cast to non-null type android.app.KeyguardManager");
            Intent intentCreateConfirmDeviceCredentialIntent = ((KeyguardManager) systemService).createConfirmDeviceCredentialIntent("Unlock your Solaris Vault", "Use your phone's screen lock to continue.");
            if (intentCreateConfirmDeviceCredentialIntent == null) {
                mVar.i0("DEVICE_LOCK_REQUIRED");
                return;
            }
            mVar.credentialEpoch = Long.valueOf(j6);
            int i6 = ((int) (j6 % ((long) 20000))) + 20000;
            mVar.credentialRequestCode = i6;
            activity.startActivityForResult(intentCreateConfirmDeviceCredentialIntent, i6);
        } catch (Exception unused) {
            mVar.i0("VAULT_UNAVAILABLE");
        }
    }

    private final void i0(String code) {
        W2.s sVar = this.promise;
        if (sVar != null) {
            sVar.reject(code, code, null);
        }
        f0();
    }

    static /* synthetic */ void j0(m mVar, String str, int i6, Object obj) {
        if ((i6 & 1) != 0) {
            str = "VAULT_OPERATION_FAILED";
        }
        mVar.i0(str);
    }

    private final void k0(Object value) {
        W2.s sVar = this.promise;
        if (sVar != null) {
            sVar.resolve(value);
        }
        f0();
    }

    public static /* synthetic */ void l(long j6, m mVar, Activity activity, boolean z6, String str, JSONObject jSONObject) {
        Z(j6, mVar, activity, z6, str, jSONObject);
    }

    private final Context l0() {
        Context applicationContext;
        Context contextX = a().x();
        if (contextX == null || (applicationContext = contextX.getApplicationContext()) == null) {
            throw new IllegalStateException("VAULT_UNAVAILABLE");
        }
        return applicationContext;
    }

    public static /* synthetic */ s m(m mVar) {
        return n0(mVar);
    }

    private final s m0() {
        return (s) this.keys.getValue();
    }

    public static /* synthetic */ Map n(m mVar, boolean z6, String str, JSONObject jSONObject) {
        return a0(mVar, z6, str, jSONObject);
    }

    private static final s n0(m mVar) {
        return new s(mVar.l0());
    }

    public static /* synthetic */ void o(long j6, m mVar, boolean z6) {
        p0(j6, mVar, z6);
    }

    private final void o0(long ticket, boolean usedCredential) {
        this.executor.execute(new g(ticket, this, usedCredential));
    }

    public static /* synthetic */ void p(long j6, m mVar, Object obj) {
        q0(j6, mVar, obj);
    }

    private static final void p0(long j6, m mVar, boolean z6) {
        Object objInvoke;
        if (j6 != mVar.authEpoch || mVar.promise == null) {
            return;
        }
        try {
            synchronized (mVar.m0()) {
                if (j6 != mVar.authEpoch) {
                    throw new IllegalStateException("CANCELLED");
                }
                I3.a aVar = mVar.nextUnlock;
                if (aVar == null || (objInvoke = aVar.invoke()) == null) {
                    throw new IllegalStateException("VAULT_UNAVAILABLE");
                }
            }
            Activity activityA = mVar.a().a();
            if (activityA != null) {
                activityA.runOnUiThread(new j(j6, mVar, objInvoke));
                return;
            }
            synchronized (mVar.m0()) {
                mVar.m0().h();
                A a6 = A.f16167a;
            }
            if (j6 == mVar.authEpoch) {
                mVar.i0("VAULT_UNAVAILABLE");
            }
        } catch (UserNotAuthenticatedException unused) {
            if (j6 == mVar.authEpoch) {
                if (z6) {
                    mVar.i0("VAULT_AUTH_REQUIRED");
                } else {
                    mVar.g0(j6);
                }
            }
        } catch (Exception unused2) {
            if (j6 == mVar.authEpoch) {
                mVar.i0("VAULT_KEY_UNAVAILABLE");
            }
        }
    }

    public static /* synthetic */ void q(long j6, m mVar, Activity activity) {
        h0(j6, mVar, activity);
    }

    private static final void q0(long j6, m mVar, Object obj) {
        if (j6 == mVar.authEpoch && mVar.promise != null) {
            mVar.k0(obj);
            return;
        }
        synchronized (mVar.m0()) {
            mVar.m0().h();
            A a6 = A.f16167a;
        }
    }

    public static /* synthetic */ void r(m mVar, I3.a aVar) {
        c0(mVar, aVar);
    }

    public static final /* synthetic */ void s(m mVar, boolean z6, String str, JSONObject jSONObject) {
        mVar.X(z6, str, jSONObject);
    }

    public static final /* synthetic */ void t(m mVar, I3.a aVar) {
        mVar.b0(aVar);
    }

    public static final /* synthetic */ boolean u(m mVar, W2.s sVar) {
        return mVar.d0(sVar);
    }

    public static final /* synthetic */ void v(m mVar) {
        mVar.f0();
    }

    public static final /* synthetic */ void w(m mVar, long j6) {
        mVar.g0(j6);
    }

    public static final /* synthetic */ void x(m mVar, String str) {
        mVar.i0(str);
    }

    public static final /* synthetic */ void y(m mVar, Object obj) {
        mVar.k0(obj);
    }

    public static final /* synthetic */ p$a z(m mVar) {
        return mVar.attachmentRequest;
    }

    @Override // p053h3.c
    public p053h3.e d() {
        p039f3.g oVar;
        p039f3.g oVar2;
        p039f3.g fVar;
        Class<Boolean> cls;
        p039f3.g oVar3;
        p039f3.g fVar2;
        p039f3.g oVar4;
        p039f3.g fVar3;
        Class<A> cls2;
        p039f3.g oVar5;
        p039f3.g fVar4;
        p039f3.g oVar6;
        p039f3.g fVar5;
        Class<Boolean> cls3 = Boolean.class;
        K.a.b("[ExpoModulesCore] " + (getClass() + ".ModuleDefinition"));
        try {
            p053h3.d dVar = new p053h3.d(this);
            dVar.p("SolarisVault");
            C0888b[] c0888bArr = new C0888b[0];
            Q q6 = Q.f14309a;
            P p6 = (P) q6.a().get(B.b(Object.class));
            if (p6 == null) {
                p6 = new P(B.b(Object.class));
                q6.a().put(B.b(Object.class), p6);
            }
            dVar.n().put("newId", new p039f3.s("newId", c0888bArr, p6, new m$K()));
            C0888b[] c0888bArr2 = new C0888b[0];
            P p7 = (P) q6.a().get(B.b(Object.class));
            if (p7 == null) {
                p7 = new P(B.b(Object.class));
                q6.a().put(B.b(Object.class), p7);
            }
            dVar.n().put("randomKey", new p039f3.s("randomKey", c0888bArr2, p7, new m$L()));
            dVar.i().put("status", new p039f3.t("status", new C0888b[0], new m$G(this)));
            T tK = dVar.k();
            C0891d c0891d = C0891d.f14345a;
            Q3.d dVarB = B.b(cls3);
            Boolean bool = Boolean.FALSE;
            C0888b c0888b = (C0888b) c0891d.a().get(new Pair(dVarB, bool));
            if (c0888b == null) {
                c0888b = new C0888b(new I(B.b(cls3), false, m$B.f1776f), tK);
            }
            C0888b c0888b2 = (C0888b) c0891d.a().get(new Pair(B.b(String.class), bool));
            if (c0888b2 == null) {
                c0888b2 = new C0888b(new I(B.b(String.class), false, m$C.f1777f), tK);
            }
            dVar.i().put("unlock", new p039f3.f("unlock", new C0888b[]{c0888b, c0888b2}, new m$D(this)));
            boolean zB = J3.l.b(W2.s.class, W2.s.class);
            Class<A> cls4 = A.class;
            Class cls5 = Float.TYPE;
            Class cls6 = Double.TYPE;
            Class cls7 = Boolean.TYPE;
            Class cls8 = Integer.TYPE;
            if (zB) {
                oVar = new p039f3.f("activateRestore", new C0888b[0], new m$s(this));
                cls3 = cls3;
                dVar = dVar;
                c0891d = c0891d;
            } else {
                T tK2 = dVar.k();
                C0888b c0888b3 = (C0888b) c0891d.a().get(new Pair(B.b(W2.s.class), bool));
                if (c0888b3 == null) {
                    c0888b3 = new C0888b(new I(B.b(W2.s.class), false, m$t.f1834f), tK2);
                }
                C0888b[] c0888bArr3 = {c0888b3};
                m$u m_u = new m$u(this);
                if (J3.l.b(cls4, cls8)) {
                    oVar = new p039f3.m("activateRestore", c0888bArr3, m_u);
                } else if (J3.l.b(cls4, cls7)) {
                    oVar = new p039f3.h("activateRestore", c0888bArr3, m_u);
                } else if (J3.l.b(cls4, cls6)) {
                    oVar = new p039f3.j("activateRestore", c0888bArr3, m_u);
                } else if (J3.l.b(cls4, cls5)) {
                    oVar = new p039f3.k("activateRestore", c0888bArr3, m_u);
                } else {
                    oVar = J3.l.b(cls4, String.class) ? new p039f3.o("activateRestore", c0888bArr3, m_u) : new p039f3.t("activateRestore", c0888bArr3, m_u);
                }
            }
            dVar.i().put("activateRestore", oVar);
            dVar.i().put("markInitialized", new p039f3.t("markInitialized", new C0888b[0], new m$H(this)));
            dVar.i().put("lock", new p039f3.t("lock", new C0888b[0], new m$I(this)));
            if (J3.l.b(String.class, W2.s.class)) {
                fVar = new p039f3.f("mac", new C0888b[0], new m$v(this));
            } else {
                T tK3 = dVar.k();
                C0888b c0888b4 = (C0888b) c0891d.a().get(new Pair(B.b(String.class), bool));
                if (c0888b4 == null) {
                    c0888b4 = new C0888b(new I(B.b(String.class), false, m$w.f1837f), tK3);
                }
                C0888b[] c0888bArr4 = {c0888b4};
                m$x m_x = new m$x(this);
                if (J3.l.b(String.class, cls8)) {
                    oVar2 = new p039f3.m("mac", c0888bArr4, m_x);
                } else if (J3.l.b(String.class, cls7)) {
                    oVar2 = new p039f3.h("mac", c0888bArr4, m_x);
                } else if (J3.l.b(String.class, cls6)) {
                    oVar2 = new p039f3.j("mac", c0888bArr4, m_x);
                } else if (J3.l.b(String.class, cls5)) {
                    oVar2 = new p039f3.k("mac", c0888bArr4, m_x);
                } else {
                    oVar2 = J3.l.b(String.class, String.class) ? new p039f3.o("mac", c0888bArr4, m_x) : new p039f3.t("mac", c0888bArr4, m_x);
                }
                fVar = oVar2;
            }
            dVar.i().put("mac", fVar);
            if (J3.l.b(String.class, W2.s.class)) {
                fVar2 = new p039f3.f("strictJson", new C0888b[0], new m$y());
                cls = cls3;
            } else {
                T tK4 = dVar.k();
                C0888b c0888b5 = (C0888b) c0891d.a().get(new Pair(B.b(String.class), bool));
                if (c0888b5 == null) {
                    c0888b5 = new C0888b(new I(B.b(String.class), false, m$z.f1839f), tK4);
                }
                C0888b[] c0888bArr5 = {c0888b5};
                m$A m_a = new m$A();
                cls = cls3;
                if (J3.l.b(cls, cls8)) {
                    oVar3 = new p039f3.m("strictJson", c0888bArr5, m_a);
                } else if (J3.l.b(cls, cls7)) {
                    oVar3 = new p039f3.h("strictJson", c0888bArr5, m_a);
                } else if (J3.l.b(cls, cls6)) {
                    oVar3 = new p039f3.j("strictJson", c0888bArr5, m_a);
                } else if (J3.l.b(cls, cls5)) {
                    oVar3 = new p039f3.k("strictJson", c0888bArr5, m_a);
                } else {
                    oVar3 = J3.l.b(cls, String.class) ? new p039f3.o("strictJson", c0888bArr5, m_a) : new p039f3.t("strictJson", c0888bArr5, m_a);
                }
                fVar2 = oVar3;
            }
            dVar.i().put("strictJson", fVar2);
            if (J3.l.b(cls, W2.s.class)) {
                fVar3 = new p039f3.f("privateScreen", new C0888b[0], new C0119m$j(this));
                cls4 = cls4;
            } else {
                T tK5 = dVar.k();
                C0888b c0888b6 = (C0888b) c0891d.a().get(new Pair(B.b(cls), bool));
                if (c0888b6 == null) {
                    c0888b6 = new C0888b(new I(B.b(cls), false, C0120m$k.f1825f), tK5);
                }
                C0888b[] c0888bArr6 = {c0888b6};
                C0121m$l c0121m$l = new C0121m$l(this);
                if (J3.l.b(cls, cls8)) {
                    oVar4 = new p039f3.m("privateScreen", c0888bArr6, c0121m$l);
                } else if (J3.l.b(cls, cls7)) {
                    oVar4 = new p039f3.h("privateScreen", c0888bArr6, c0121m$l);
                } else if (J3.l.b(cls, cls6)) {
                    oVar4 = new p039f3.j("privateScreen", c0888bArr6, c0121m$l);
                } else if (J3.l.b(cls, cls5)) {
                    oVar4 = new p039f3.k("privateScreen", c0888bArr6, c0121m$l);
                } else {
                    oVar4 = J3.l.b(cls, String.class) ? new p039f3.o("privateScreen", c0888bArr6, c0121m$l) : new p039f3.t("privateScreen", c0888bArr6, c0121m$l);
                }
                fVar3 = oVar4;
            }
            dVar.i().put("privateScreen", fVar3);
            dVar.i().put("cancelAttachment", new p039f3.t("cancelAttachment", new C0888b[0], new m$J(this)));
            if (J3.l.b(W2.s.class, W2.s.class)) {
                fVar4 = new p039f3.f("pickAttachment", new C0888b[0], new C0122m$m(this));
                cls2 = cls4;
            } else {
                T tK6 = dVar.k();
                C0888b c0888b7 = (C0888b) c0891d.a().get(new Pair(B.b(W2.s.class), bool));
                if (c0888b7 == null) {
                    c0888b7 = new C0888b(new I(B.b(W2.s.class), false, C0123m$n.f1828f), tK6);
                }
                C0888b[] c0888bArr7 = {c0888b7};
                m$o m_o = new m$o(this);
                cls2 = cls4;
                if (J3.l.b(cls2, cls8)) {
                    oVar5 = new p039f3.m("pickAttachment", c0888bArr7, m_o);
                } else if (J3.l.b(cls2, cls7)) {
                    oVar5 = new p039f3.h("pickAttachment", c0888bArr7, m_o);
                } else if (J3.l.b(cls2, cls6)) {
                    oVar5 = new p039f3.j("pickAttachment", c0888bArr7, m_o);
                } else if (J3.l.b(cls2, cls5)) {
                    oVar5 = new p039f3.k("pickAttachment", c0888bArr7, m_o);
                } else {
                    oVar5 = J3.l.b(cls2, String.class) ? new p039f3.o("pickAttachment", c0888bArr7, m_o) : new p039f3.t("pickAttachment", c0888bArr7, m_o);
                }
                fVar4 = oVar5;
            }
            dVar.i().put("pickAttachment", fVar4);
            T tK7 = dVar.k();
            C0888b c0888b8 = (C0888b) c0891d.a().get(new Pair(B.b(String.class), bool));
            if (c0888b8 == null) {
                c0888b8 = new C0888b(new I(B.b(String.class), false, m$E.f1779f), tK7);
            }
            dVar.i().put("backup", new p039f3.f("backup", new C0888b[]{c0888b8}, new m$F(this)));
            if (J3.l.b(W2.s.class, W2.s.class)) {
                fVar5 = new p039f3.f("restorePreview", new C0888b[0], new m$p(this));
            } else {
                T tK8 = dVar.k();
                C0888b c0888b9 = (C0888b) c0891d.a().get(new Pair(B.b(W2.s.class), bool));
                if (c0888b9 == null) {
                    c0888b9 = new C0888b(new I(B.b(W2.s.class), false, m$q.f1831f), tK8);
                }
                C0888b[] c0888bArr8 = {c0888b9};
                m$r m_r = new m$r(this);
                if (J3.l.b(cls2, cls8)) {
                    oVar6 = new p039f3.m("restorePreview", c0888bArr8, m_r);
                } else if (J3.l.b(cls2, cls7)) {
                    oVar6 = new p039f3.h("restorePreview", c0888bArr8, m_r);
                } else if (J3.l.b(cls2, cls6)) {
                    oVar6 = new p039f3.j("restorePreview", c0888bArr8, m_r);
                } else if (J3.l.b(cls2, cls5)) {
                    oVar6 = new p039f3.k("restorePreview", c0888bArr8, m_r);
                } else {
                    oVar6 = J3.l.b(cls2, String.class) ? new p039f3.o("restorePreview", c0888bArr8, m_r) : new p039f3.t("restorePreview", c0888bArr8, m_r);
                }
                fVar5 = oVar6;
            }
            dVar.i().put("restorePreview", fVar5);
            Map mapT = dVar.t();
            p025d3.e eVar = p025d3.e.ON_ACTIVITY_RESULT;
            mapT.put(eVar, new p025d3.d(eVar, new m$M(this)));
            Map mapT2 = dVar.t();
            p025d3.e eVar2 = p025d3.e.MODULE_DESTROY;
            mapT2.put(eVar2, new p025d3.a(eVar2, new m$N(this)));
            return dVar.r();
        } finally {
            K.a.d();
        }
    }
}
