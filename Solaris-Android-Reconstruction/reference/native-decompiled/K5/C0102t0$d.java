package K5;

import android.os.Bundle;
import android.speech.RecognitionListener;
import java.util.ArrayList;
import p143v3.AbstractC0975j;
import p143v3.AbstractC0982q;

/* JADX INFO: renamed from: K5.t0$d, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0102t0$d implements RecognitionListener {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    final /* synthetic */ long f1679a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    final /* synthetic */ C0098t0 f1680b;

    C0102t0$d(long j6, C0098t0 c0098t0) {
        this.f1679a = j6;
        this.f1680b = c0098t0;
    }

    public static /* synthetic */ void a(long j6, C0098t0 c0098t0) {
        b(j6, c0098t0);
    }

    private static final void b(long j6, C0098t0 c0098t0) {
        if (j6 == C0098t0.k(c0098t0)) {
            C0098t0.H(c0098t0, "TRANSCRIPTION_TIMEOUT", null, 2, null);
        }
    }

    @Override // android.speech.RecognitionListener
    public void onBeginningOfSpeech() {
    }

    @Override // android.speech.RecognitionListener
    public void onBufferReceived(byte[] bArr) {
        if (bArr != null) {
            AbstractC0975j.o(bArr, (byte) 0, 0, 0, 6, null);
        }
    }

    @Override // android.speech.RecognitionListener
    public void onEndOfSpeech() {
        if (this.f1679a == C0098t0.k(this.f1680b)) {
            C0098t0.F(this.f1680b, "transcribing", null, null, null, null, 30, null);
            C0098t0.m(this.f1680b).postDelayed(new x0(this.f1679a, this.f1680b), 15000L);
        }
    }

    @Override // android.speech.RecognitionListener
    public void onError(int i6) {
        String strA;
        if (this.f1679a != C0098t0.k(this.f1680b)) {
            return;
        }
        C0098t0 c0098t0 = this.f1680b;
        if (J3.l.b(C0098t0.n(c0098t0), "downloading")) {
            strA = y0.f1692a.a(i6);
        } else if (i6 == 6 || i6 == 7) {
            strA = "NO_SPEECH_HEARD";
        } else if (i6 != 9) {
            strA = (i6 == 12 || i6 == 13) ? "LANGUAGE_RESOURCE_REQUIRED" : "ON_DEVICE_TRANSCRIPTION_FAILED";
        } else {
            strA = "MICROPHONE_DENIED";
        }
        C0098t0.i(c0098t0, strA, Integer.valueOf(i6));
    }

    @Override // android.speech.RecognitionListener
    public void onEvent(int i6, Bundle bundle) {
    }

    @Override // android.speech.RecognitionListener
    public void onPartialResults(Bundle bundle) {
    }

    @Override // android.speech.RecognitionListener
    public void onReadyForSpeech(Bundle bundle) {
    }

    @Override // android.speech.RecognitionListener
    public void onResults(Bundle bundle) {
        ArrayList<String> stringArrayList;
        String str;
        if (this.f1679a != C0098t0.k(this.f1680b)) {
            return;
        }
        String strE = (bundle == null || (stringArrayList = bundle.getStringArrayList("results_recognition")) == null || (str = (String) AbstractC0982q.d0(stringArrayList)) == null) ? null : y0.f1692a.e(str);
        C0098t0.s(this.f1680b, C0098t0.k(this.f1680b) + 1);
        C0098t0.p(this.f1680b);
        if (strE == null) {
            C0098t0.F(this.f1680b, "error", "TRANSCRIPT_EMPTY_OR_TOO_LONG", null, null, null, 28, null);
        } else {
            C0098t0.F(this.f1680b, "review", null, strE, null, null, 26, null);
        }
        C0098t0.u(this.f1680b, 0L);
    }

    @Override // android.speech.RecognitionListener
    public void onRmsChanged(float f6) {
    }
}
