package K5;

import android.health.connect.ReadRecordsRequestUsingFilters$Builder;
import android.health.connect.TimeRangeFilter;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class G {
    public static /* bridge */ /* synthetic */ ReadRecordsRequestUsingFilters$Builder a(ReadRecordsRequestUsingFilters$Builder readRecordsRequestUsingFilters$Builder, TimeRangeFilter timeRangeFilter) {
        return readRecordsRequestUsingFilters$Builder.setTimeRangeFilter(timeRangeFilter);
    }
}
