package K5;

import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class T0$g0 implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1592f;

    public T0$g0(T0 t6) {
        this.f1592f = t6;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<destruct>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        String str = (String) objArr[0];
        T0 t6 = this.f1592f;
        T0.F(t6, sVar, new C0047T0$n(t6, str));
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return p137u3.A.f16167a;
    }
}
