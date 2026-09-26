package K5;

import android.health.connect.AggregateRecordsRequest$Builder;
import android.health.connect.datatypes.AggregationType;

/* JADX INFO: renamed from: K5.d, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class AbstractC0066d {
    public static /* bridge */ /* synthetic */ AggregateRecordsRequest$Builder a(AggregateRecordsRequest$Builder aggregateRecordsRequest$Builder, AggregationType aggregationType) {
        return aggregateRecordsRequest$Builder.addAggregationType(aggregationType);
    }
}
