package K5;

import android.view.View;
import android.view.View$OnClickListener;
import org.solarishealth.runtime.HealthPermissionActivity;

/* JADX INFO: renamed from: K5.a, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class ViewOnClickListenerC0060a implements View$OnClickListener {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ HealthPermissionActivity f1630f;

    public /* synthetic */ ViewOnClickListenerC0060a(HealthPermissionActivity healthPermissionActivity) {
        this.f1630f = healthPermissionActivity;
    }

    @Override // android.view.View$OnClickListener
    public final void onClick(View view) {
        HealthPermissionActivity.a(this.f1630f, view);
    }
}
