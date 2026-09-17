package K5;

import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes$Builder;
import android.media.AudioFocusRequest;
import android.media.AudioFocusRequest$Builder;
import android.media.AudioManager;
import android.os.Build$VERSION;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.speech.SpeechRecognizer;
import com.facebook.react.views.progressbar.ReactProgressBarViewManager;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.Executor;
import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: K5.t0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0098t0 {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final Context f1656a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private final Function1 f1657b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private final Handler f1658c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    private SpeechRecognizer f1659d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    private long f1660e;

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    private long f1661f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    private String f1662g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    private String f1663h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    private String f1664i;

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    private AudioFocusRequest f1665j;

    /* JADX INFO: renamed from: k, reason: collision with root package name */
    private Map f1666k;

    public C0098t0(Context context, Function1 function1) {
        J3.l.f(context, "context");
        J3.l.f(function1, "emit");
        this.f1656a = context;
        this.f1657b = function1;
        this.f1658c = new Handler(Looper.getMainLooper());
        this.f1662g = "ready";
        this.f1663h = "en-US";
        this.f1664i = "";
        this.f1666k = p143v3.L.h();
    }

    public static /* synthetic */ void B(C0098t0 c0098t0, String str, int i6, Object obj) {
        if ((i6 & 1) != 0) {
            str = "CANCELLED";
        }
        c0098t0.A(str);
    }

    private final SpeechRecognizer C() {
        if (Build$VERSION.SDK_INT < 33 || !AbstractC0077i0.a(this.f1656a)) {
            return null;
        }
        return AbstractC0079j0.a(this.f1656a);
    }

    private final Map E(String str, String str2, String str3, Integer num, Integer num2) {
        this.f1662g = str;
        LinkedHashMap linkedHashMapK = p143v3.L.k(p137u3.s.a("state", str), p137u3.s.a("locale", this.f1663h), p137u3.s.a("requestId", this.f1664i), p137u3.s.a("engine", "android-on-device"), p137u3.s.a("reason", str2), p137u3.s.a("resourceBytes", null), p137u3.s.a("resourceSizeKnown", Boolean.FALSE), p137u3.s.a("maxDurationMs", 60000L), p137u3.s.a("elapsedMs", Long.valueOf(this.f1661f != 0 ? P3.g.h(SystemClock.elapsedRealtime() - this.f1661f, 60000L) : 0L)), p137u3.s.a("transcript", str3), p137u3.s.a(ReactProgressBarViewManager.PROP_PROGRESS, num), p137u3.s.a("errorCode", num2));
        this.f1666k = linkedHashMapK;
        this.f1657b.q(linkedHashMapK);
        return linkedHashMapK;
    }

    static /* synthetic */ Map F(C0098t0 c0098t0, String str, String str2, String str3, Integer num, Integer num2, int i6, Object obj) {
        if ((i6 & 2) != 0) {
            str2 = null;
        }
        if ((i6 & 4) != 0) {
            str3 = null;
        }
        if ((i6 & 8) != 0) {
            num = null;
        }
        if ((i6 & 16) != 0) {
            num2 = null;
        }
        return c0098t0.E(str, str2, str3, num, num2);
    }

    private final void G(String str, Integer num) {
        this.f1660e++;
        N();
        F(this, p143v3.U.h("MICROPHONE_DENIED", "MICROPHONE_REQUIRED").contains(str) ? "permission-denied" : "error", str, null, null, num, 12, null);
        this.f1661f = 0L;
    }

    static /* synthetic */ void H(C0098t0 c0098t0, String str, Integer num, int i6, Object obj) {
        if ((i6 & 2) != 0) {
            num = null;
        }
        c0098t0.G(str, num);
    }

    private final AudioManager I() {
        return (AudioManager) this.f1656a.getSystemService(AudioManager.class);
    }

    private final void J(String str, String str2, String str3, Function1 function1) {
        Function1 function2;
        SpeechRecognizer speechRecognizerC = null;
        B(this, null, 1, null);
        this.f1663h = str;
        this.f1664i = str2;
        if (y0.f1692a.c(str) == null) {
            function1.q(F(this, "unavailable", "LANGUAGE_NOT_SUPPORTED", null, null, null, 28, null));
            return;
        }
        C0098t0 c0098t0 = this;
        if (c0098t0.f1656a.checkSelfPermission("android.permission.RECORD_AUDIO") != 0) {
            function1.q(F(c0098t0, "permission-denied", "MICROPHONE_REQUIRED", null, null, null, 28, null));
            return;
        }
        if (Build$VERSION.SDK_INT < 33) {
            function1.q(F(c0098t0, "unavailable", "ANDROID_VERSION_UNSUPPORTED", null, null, null, 28, null));
            return;
        }
        try {
            speechRecognizerC = c0098t0.C();
        } catch (Exception unused) {
        }
        SpeechRecognizer speechRecognizer = speechRecognizerC;
        if (speechRecognizer == null) {
            function1.q(F(c0098t0, "unavailable", "ON_DEVICE_RECOGNIZER_UNAVAILABLE", null, null, null, 28, null));
            return;
        }
        c0098t0.f1659d = speechRecognizer;
        long j6 = c0098t0.f1660e;
        speechRecognizer.setRecognitionListener(c0098t0.M(j6));
        RunnableC0093q0 runnableC0093q0 = new RunnableC0093q0(j6, c0098t0, function1);
        c0098t0.f1658c.postDelayed(runnableC0093q0, 8000L);
        try {
            Intent intentL = c0098t0.L(str);
            Executor mainExecutor = c0098t0.f1656a.getMainExecutor();
            try {
                function2 = function1;
                try {
                    C0101t0$c c0101t0$c = new C0101t0$c(j6, c0098t0, runnableC0093q0, str, str3, speechRecognizer, function2);
                    c0098t0 = c0098t0;
                    try {
                        AbstractC0075h0.a(speechRecognizer, intentL, mainExecutor, AbstractC0073g0.a(c0101t0$c));
                    } catch (Exception unused2) {
                        c0098t0.N();
                        function2.q(F(c0098t0, "unavailable", "LANGUAGE_CHECK_FAILED", null, null, null, 28, null));
                    }
                } catch (Exception unused3) {
                    c0098t0 = c0098t0;
                    c0098t0.N();
                    function2.q(F(c0098t0, "unavailable", "LANGUAGE_CHECK_FAILED", null, null, null, 28, null));
                }
            } catch (Exception unused4) {
                function2 = function1;
            }
        } catch (Exception unused5) {
            function2 = function1;
        }
    }

    private static final void K(long j6, C0098t0 c0098t0, Function1 function1) {
        if (j6 == c0098t0.f1660e) {
            H(c0098t0, "LANGUAGE_CHECK_TIMEOUT", null, 2, null);
            function1.q(F(c0098t0, "error", "LANGUAGE_CHECK_TIMEOUT", null, null, null, 28, null));
        }
    }

    private final Intent L(String str) {
        Intent intent = new Intent("android.speech.action.RECOGNIZE_SPEECH");
        intent.putExtra("android.speech.extra.LANGUAGE_MODEL", "free_form");
        intent.putExtra("android.speech.extra.LANGUAGE", str);
        intent.putExtra("android.speech.extra.PARTIAL_RESULTS", false);
        intent.putExtra("android.speech.extra.MAX_RESULTS", 1);
        return intent;
    }

    private final C0102t0$d M(long j6) {
        return new C0102t0$d(j6, this);
    }

    private final void N() {
        this.f1660e++;
        this.f1658c.removeCallbacksAndMessages(null);
        SpeechRecognizer speechRecognizer = this.f1659d;
        if (speechRecognizer != null) {
            try {
                speechRecognizer.cancel();
                speechRecognizer.destroy();
            } catch (Exception unused) {
            }
        }
        this.f1659d = null;
        AudioFocusRequest audioFocusRequest = this.f1665j;
        if (audioFocusRequest != null) {
            try {
                I().abandonAudioFocusRequest(audioFocusRequest);
            } catch (Exception unused2) {
                p137u3.A a6 = p137u3.A.f16167a;
            }
        }
        this.f1665j = null;
    }

    private final void O(SpeechRecognizer speechRecognizer, long j6, Integer num) {
        try {
            AbstractC0085m0.a(speechRecognizer, L(this.f1663h));
            F(this, "downloading", "RESOURCE_DOWNLOAD_REQUESTED_RECHECK", null, null, num, 12, null);
            long jElapsedRealtime = SystemClock.elapsedRealtime() + 20000;
            J3.A a6 = new J3.A();
            RunnableC0103t0$e runnableC0103t0$e = new RunnableC0103t0$e(j6, this, jElapsedRealtime, speechRecognizer, num, a6);
            a6.f1200f = runnableC0103t0$e;
            this.f1658c.postDelayed(runnableC0103t0$e, 2000L);
            this.f1658c.postDelayed(new RunnableC0091p0(j6, this, num), 20000L);
        } catch (Exception unused) {
            N();
            F(this, "error", "RESOURCE_DOWNLOAD_FAILED", null, null, num, 12, null);
        }
    }

    static /* synthetic */ void P(C0098t0 c0098t0, SpeechRecognizer speechRecognizer, long j6, Integer num, int i6, Object obj) {
        if ((i6 & 4) != 0) {
            num = null;
        }
        c0098t0.O(speechRecognizer, j6, num);
    }

    private static final void Q(long j6, C0098t0 c0098t0, Integer num) {
        if (j6 == c0098t0.f1660e) {
            R(j6, c0098t0, num);
        }
    }

    private static final void R(long j6, C0098t0 c0098t0, Integer num) {
        if (j6 != c0098t0.f1660e) {
            return;
        }
        c0098t0.N();
        F(c0098t0, "unavailable", "RESOURCE_DOWNLOAD_REQUESTED_RECHECK", null, null, num, 12, null);
    }

    private final Map S() {
        return this.f1666k;
    }

    private static final void W(long j6, C0098t0 c0098t0) {
        if (j6 == c0098t0.f1660e && p143v3.U.h("stopping", "transcribing").contains(c0098t0.f1662g)) {
            H(c0098t0, "TRANSCRIPTION_TIMEOUT", null, 2, null);
        }
    }

    public static /* synthetic */ void a(long j6, C0098t0 c0098t0) {
        w(j6, c0098t0);
    }

    public static /* synthetic */ void b(long j6, C0098t0 c0098t0, Function1 function1) {
        K(j6, c0098t0, function1);
    }

    public static /* synthetic */ void c(long j6, C0098t0 c0098t0) {
        z(j6, c0098t0);
    }

    public static /* synthetic */ void d(long j6, C0098t0 c0098t0, int i6) {
        y(j6, c0098t0, i6);
    }

    public static /* synthetic */ void e(long j6, C0098t0 c0098t0, Integer num) {
        Q(j6, c0098t0, num);
    }

    public static /* synthetic */ void f(long j6, C0098t0 c0098t0) {
        W(j6, c0098t0);
    }

    public static final /* synthetic */ void g(C0098t0 c0098t0, SpeechRecognizer speechRecognizer, long j6, Function1 function1) {
        c0098t0.v(speechRecognizer, j6, function1);
    }

    public static final /* synthetic */ void h(C0098t0 c0098t0, SpeechRecognizer speechRecognizer, long j6, Function1 function1) {
        c0098t0.x(speechRecognizer, j6, function1);
    }

    public static final /* synthetic */ void i(C0098t0 c0098t0, String str, Integer num) {
        c0098t0.G(str, num);
    }

    public static final /* synthetic */ Context j(C0098t0 c0098t0) {
        return c0098t0.f1656a;
    }

    public static final /* synthetic */ long k(C0098t0 c0098t0) {
        return c0098t0.f1660e;
    }

    public static final /* synthetic */ String l(C0098t0 c0098t0) {
        return c0098t0.f1663h;
    }

    public static final /* synthetic */ Handler m(C0098t0 c0098t0) {
        return c0098t0.f1658c;
    }

    public static final /* synthetic */ String n(C0098t0 c0098t0) {
        return c0098t0.f1662g;
    }

    public static final /* synthetic */ Intent o(C0098t0 c0098t0, String str) {
        return c0098t0.L(str);
    }

    public static final /* synthetic */ void p(C0098t0 c0098t0) {
        c0098t0.N();
    }

    public static final /* synthetic */ void q(C0098t0 c0098t0, SpeechRecognizer speechRecognizer, long j6, Integer num) {
        c0098t0.O(speechRecognizer, j6, num);
    }

    public static final /* synthetic */ void r(long j6, C0098t0 c0098t0, Integer num) {
        R(j6, c0098t0, num);
    }

    public static final /* synthetic */ void s(C0098t0 c0098t0, long j6) {
        c0098t0.f1660e = j6;
    }

    public static final /* synthetic */ void t(C0098t0 c0098t0, String str) {
        c0098t0.f1663h = str;
    }

    public static final /* synthetic */ void u(C0098t0 c0098t0, long j6) {
        c0098t0.f1661f = j6;
    }

    private final void v(SpeechRecognizer speechRecognizer, long j6, Function1 function1) {
        F(this, "downloading", "SYSTEM_MANAGED_SIZE_UNKNOWN", null, null, null, 28, null);
        this.f1658c.postDelayed(new RunnableC0096s0(j6, this), 120000L);
        try {
            if (Build$VERSION.SDK_INT >= 34) {
                AbstractC0083l0.a(speechRecognizer, L(this.f1663h), this.f1656a.getMainExecutor(), AbstractC0081k0.a(new C0099t0$a(j6, this, speechRecognizer)));
            } else {
                P(this, speechRecognizer, j6, null, 4, null);
            }
            function1.q(S());
        } catch (Exception unused) {
            N();
            function1.q(F(this, "error", "RESOURCE_DOWNLOAD_FAILED", null, null, null, 28, null));
        }
    }

    private static final void w(long j6, C0098t0 c0098t0) {
        if (j6 == c0098t0.f1660e) {
            c0098t0.N();
            F(c0098t0, "unavailable", "RESOURCE_DOWNLOAD_TIMEOUT_RECHECK", null, null, null, 28, null);
        }
    }

    private final void x(SpeechRecognizer speechRecognizer, long j6, Function1 function1) {
        AudioFocusRequest audioFocusRequestBuild = new AudioFocusRequest$Builder(4).setAudioAttributes(new AudioAttributes$Builder().setUsage(16).setContentType(1).build()).setOnAudioFocusChangeListener(new C0087n0(j6, this), this.f1658c).build();
        this.f1665j = audioFocusRequestBuild;
        if (I().requestAudioFocus(audioFocusRequestBuild) != 1) {
            H(this, "AUDIO_BUSY", null, 2, null);
            function1.q(F(this, "error", "AUDIO_BUSY", null, null, null, 28, null));
            return;
        }
        try {
            this.f1661f = SystemClock.elapsedRealtime();
            speechRecognizer.startListening(L(this.f1663h));
            function1.q(F(this, "recording", null, null, null, null, 30, null));
            this.f1658c.postDelayed(new RunnableC0089o0(j6, this), 60000L);
            this.f1658c.postDelayed(new RunnableC0100t0$b(j6, this), 1000L);
        } catch (Exception unused) {
            H(this, "VOICE_START_FAILED", null, 2, null);
            function1.q(F(this, "error", "VOICE_START_FAILED", null, null, null, 28, null));
        }
    }

    private static final void y(long j6, C0098t0 c0098t0, int i6) {
        if (i6 >= 0 || j6 != c0098t0.f1660e) {
            return;
        }
        c0098t0.A("AUDIO_INTERRUPTED");
    }

    private static final void z(long j6, C0098t0 c0098t0) {
        if (j6 == c0098t0.f1660e && J3.l.b(c0098t0.f1662g, "recording")) {
            c0098t0.V();
        }
    }

    public final void A(String str) {
        J3.l.f(str, "reason");
        this.f1660e++;
        N();
        this.f1661f = 0L;
        F(this, "ready", str, null, null, null, 28, null);
    }

    public final void D(String str, String str2, Function1 function1) {
        J3.l.f(str, "tag");
        J3.l.f(str2, "id");
        J3.l.f(function1, "done");
        if (p143v3.U.h("recording", "stopping", "transcribing", "downloading").contains(this.f1662g)) {
            function1.q(F(this, this.f1662g, "VOICE_BUSY", null, null, null, 28, null));
        } else {
            J(str, str2, "download", function1);
        }
    }

    public final void T(String str, String str2, Function1 function1) {
        J3.l.f(str, "tag");
        J3.l.f(str2, "id");
        J3.l.f(function1, "done");
        if (p143v3.U.h("recording", "stopping", "transcribing").contains(this.f1662g)) {
            function1.q(F(this, this.f1662g, "VOICE_BUSY", null, null, null, 28, null));
            return;
        }
        this.f1664i = str2;
        if (this.f1656a.checkSelfPermission("android.permission.RECORD_AUDIO") != 0) {
            function1.q(F(this, "permission-denied", "MICROPHONE_DENIED", null, null, null, 28, null));
        } else {
            J(str, str2, "start", function1);
        }
    }

    public final void U(String str, String str2, Function1 function1) {
        J3.l.f(str, "tag");
        J3.l.f(str2, "id");
        J3.l.f(function1, "done");
        if (p143v3.U.h("recording", "stopping", "transcribing", "downloading").contains(this.f1662g)) {
            function1.q(F(this, this.f1662g, null, null, null, null, 30, null));
        } else {
            J(str, str2, "status", function1);
        }
    }

    public final Map V() {
        if (!J3.l.b(this.f1662g, "recording")) {
            return F(this, this.f1662g, null, null, null, null, 30, null);
        }
        F(this, "stopping", null, null, null, null, 30, null);
        try {
            SpeechRecognizer speechRecognizer = this.f1659d;
            if (speechRecognizer != null) {
                speechRecognizer.stopListening();
            }
        } catch (Exception unused) {
            H(this, "VOICE_STOP_FAILED", null, 2, null);
        }
        this.f1658c.postDelayed(new RunnableC0094r0(this.f1660e, this), 15000L);
        return F(this, this.f1662g, null, null, null, null, 30, null);
    }
}
