package L5;

import java.security.SecureRandom;
import kotlin.jvm.functions.Function1;
import p143v3.AbstractC0975j;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$L implements Function1 {
    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "it");
        byte[] bArr = new byte[32];
        new SecureRandom().nextBytes(bArr);
        return AbstractC0975j.Z(bArr, "", null, null, 0, null, C0118m$i.f1823f, 30, null);
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
