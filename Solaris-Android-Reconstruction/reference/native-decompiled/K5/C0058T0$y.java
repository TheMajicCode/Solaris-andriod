package K5;

import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;

/* JADX INFO: renamed from: K5.T0$y, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0058T0$y implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1622f;

    public C0058T0$y(T0 t6) {
        this.f1622f = t6;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<unused var>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        T0 t6 = this.f1622f;
        T0.G(t6, sVar, new C0038T0$e(t6));
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return p137u3.A.f16167a;
    }
}
