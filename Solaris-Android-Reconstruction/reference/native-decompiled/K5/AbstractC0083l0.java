package K5;

import android.content.Intent;
import android.speech.ModelDownloadListener;
import android.speech.SpeechRecognizer;
import java.util.concurrent.Executor;

/* JADX INFO: renamed from: K5.l0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class AbstractC0083l0 {
    public static /* bridge */ /* synthetic */ void a(SpeechRecognizer speechRecognizer, Intent intent, Executor executor, ModelDownloadListener modelDownloadListener) {
        speechRecognizer.triggerModelDownload(intent, executor, modelDownloadListener);
    }
}
