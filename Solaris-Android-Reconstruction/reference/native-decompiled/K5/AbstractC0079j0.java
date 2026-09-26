package K5;

import android.content.Context;
import android.speech.SpeechRecognizer;

/* JADX INFO: renamed from: K5.j0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class AbstractC0079j0 {
    public static /* bridge */ /* synthetic */ SpeechRecognizer a(Context context) {
        return SpeechRecognizer.createOnDeviceSpeechRecognizer(context);
    }
}
