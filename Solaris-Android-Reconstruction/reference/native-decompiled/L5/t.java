package L5;

import android.app.Activity;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class t implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ Activity f1855f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ boolean f1856g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Function1 f1857h;

    public /* synthetic */ t(Activity activity, boolean z6, Function1 function1) {
        this.f1855f = activity;
        this.f1856g = z6;
        this.f1857h = function1;
    }

    @Override // java.lang.Runnable
    public final void run() {
        y.c(this.f1855f, this.f1856g, this.f1857h);
    }
}
