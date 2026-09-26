package L5;

import android.app.Activity;
import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: L5.m$l, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0121m$l implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1826f;

    public C0121m$l(m mVar) {
        this.f1826f = mVar;
    }

    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "<destruct>");
        boolean zBooleanValue = ((Boolean) objArr[0]).booleanValue();
        Activity activityA = this.f1826f.a().a();
        if (activityA != null) {
            activityA.runOnUiThread(new RunnableC0111m$b(this.f1826f, zBooleanValue));
        }
        return Boolean.TRUE;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
