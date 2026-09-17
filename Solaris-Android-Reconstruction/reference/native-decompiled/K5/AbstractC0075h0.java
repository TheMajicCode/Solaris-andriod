package K5;

import android.content.Intent;
import android.speech.RecognitionSupportCallback;
import android.speech.SpeechRecognizer;
import java.util.concurrent.Executor;

/* JADX INFO: renamed from: K5.h0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class AbstractC0075h0 {
    public static /* bridge */ /* synthetic */ void a(SpeechRecognizer speechRecognizer, Intent intent, Executor executor, RecognitionSupportCallback recognitionSupportCallback) {
        speechRecognizer.checkRecognitionSupport(intent, executor, recognitionSupportCallback);
    }
}
