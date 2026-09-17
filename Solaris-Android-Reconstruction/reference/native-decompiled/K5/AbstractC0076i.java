package K5;

import android.health.connect.AggregateRecordsResponse;
import android.health.connect.datatypes.AggregationType;
import java.util.Set;

/* JADX INFO: renamed from: K5.i, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class AbstractC0076i {
    public static /* bridge */ /* synthetic */ Set a(AggregateRecordsResponse aggregateRecordsResponse, AggregationType aggregationType) {
        return aggregateRecordsResponse.getDataOrigins(aggregationType);
    }
}
