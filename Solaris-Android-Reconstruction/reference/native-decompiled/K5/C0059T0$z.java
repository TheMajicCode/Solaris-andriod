package K5;

import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;

/* JADX INFO: renamed from: K5.T0$z, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0059T0$z implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1623f;

    public C0059T0$z(T0 t6) {
        this.f1623f = t6;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<unused var>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        T0 t6 = this.f1623f;
        T0.F(t6, sVar, new C0041T0$h(t6));
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return p137u3.A.f16167a;
    }
}
