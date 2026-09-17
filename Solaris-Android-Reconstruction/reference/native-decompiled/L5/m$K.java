package L5;

import java.util.UUID;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$K implements Function1 {
    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "it");
        return UUID.randomUUID().toString();
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
