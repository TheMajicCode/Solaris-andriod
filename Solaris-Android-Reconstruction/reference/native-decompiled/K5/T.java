package K5;

import android.health.connect.TimeInstantRangeFilter$Builder;
import java.time.Instant;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class T {
    public static /* bridge */ /* synthetic */ TimeInstantRangeFilter$Builder a(TimeInstantRangeFilter$Builder timeInstantRangeFilter$Builder, Instant instant) {
        return timeInstantRangeFilter$Builder.setStartTime(instant);
    }
}
