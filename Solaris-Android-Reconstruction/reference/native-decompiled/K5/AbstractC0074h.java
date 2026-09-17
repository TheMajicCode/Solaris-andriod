package K5;

import android.health.connect.AggregateRecordsResponse;
import android.health.connect.datatypes.AggregationType;

/* JADX INFO: renamed from: K5.h, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class AbstractC0074h {
    public static /* bridge */ /* synthetic */ Object a(AggregateRecordsResponse aggregateRecordsResponse, AggregationType aggregationType) {
        return aggregateRecordsResponse.get(aggregationType);
    }
}
