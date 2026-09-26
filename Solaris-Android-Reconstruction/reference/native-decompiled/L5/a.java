package L5;

import android.view.Window;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class a {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final a f1734a = new a();

    private a() {
    }

    public static /* synthetic */ void b(a aVar, Window window, boolean z6, int i6, Object obj) {
        if ((i6 & 2) != 0) {
            z6 = true;
        }
        aVar.a(window, z6);
    }

    public final void a(Window window, boolean z6) {
        if (window != null) {
            window.clearFlags(8192);
        }
    }
}
