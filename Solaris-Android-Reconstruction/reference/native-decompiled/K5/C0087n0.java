package K5;

import android.media.AudioManager$OnAudioFocusChangeListener;

/* JADX INFO: renamed from: K5.n0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class C0087n0 implements AudioManager$OnAudioFocusChangeListener {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public final /* synthetic */ long f1642a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    public final /* synthetic */ C0098t0 f1643b;

    public /* synthetic */ C0087n0(long j6, C0098t0 c0098t0) {
        this.f1642a = j6;
        this.f1643b = c0098t0;
    }

    @Override // android.media.AudioManager$OnAudioFocusChangeListener
    public final void onAudioFocusChange(int i6) {
        C0098t0.d(this.f1642a, this.f1643b, i6);
    }
}
