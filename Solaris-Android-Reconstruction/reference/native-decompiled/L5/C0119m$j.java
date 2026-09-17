package L5;

import android.app.Activity;
import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;
import p137u3.A;

/* JADX INFO: renamed from: L5.m$j, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0119m$j implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1824f;

    public C0119m$j(m mVar) {
        this.f1824f = mVar;
    }

    /* JADX WARN: Multi-variable type inference failed */
    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<unused var>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        boolean zBooleanValue = ((Boolean) sVar).booleanValue();
        Activity activityA = this.f1824f.a().a();
        if (activityA != null) {
            activityA.runOnUiThread(new RunnableC0111m$b(this.f1824f, zBooleanValue));
        }
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return A.f16167a;
    }
}
