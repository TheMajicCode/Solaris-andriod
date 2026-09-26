package L5;

import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$D implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1778f;

    public m$D(m mVar) {
        this.f1778f = mVar;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<destruct>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        Object obj = objArr[0];
        String str = (String) objArr[1];
        boolean zBooleanValue = ((Boolean) obj).booleanValue();
        if (m.u(this.f1778f, sVar)) {
            m.Y(this.f1778f, zBooleanValue, str, null, 4, null);
        }
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return A.f16167a;
    }
}
