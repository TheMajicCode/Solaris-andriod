package L5;

import android.app.AlertDialog;
import android.view.View;
import android.view.View$OnClickListener;
import android.widget.EditText;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class x implements View$OnClickListener {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ EditText f1869f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ boolean f1870g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ EditText f1871h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    public final /* synthetic */ AlertDialog f1872i;

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    public final /* synthetic */ Function1 f1873j;

    public /* synthetic */ x(EditText editText, boolean z6, EditText editText2, AlertDialog alertDialog, Function1 function1) {
        this.f1869f = editText;
        this.f1870g = z6;
        this.f1871h = editText2;
        this.f1872i = alertDialog;
        this.f1873j = function1;
    }

    @Override // android.view.View$OnClickListener
    public final void onClick(View view) {
        y.a(this.f1869f, this.f1870g, this.f1871h, this.f1872i, this.f1873j, view);
    }
}
