package L5;

import android.content.DialogInterface;
import android.content.DialogInterface$OnCancelListener;
import android.widget.EditText;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class v implements DialogInterface$OnCancelListener {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ EditText f1861f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ EditText f1862g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Function1 f1863h;

    public /* synthetic */ v(EditText editText, EditText editText2, Function1 function1) {
        this.f1861f = editText;
        this.f1862g = editText2;
        this.f1863h = function1;
    }

    @Override // android.content.DialogInterface$OnCancelListener
    public final void onCancel(DialogInterface dialogInterface) {
        y.b(this.f1861f, this.f1862g, this.f1863h, dialogInterface);
    }
}
