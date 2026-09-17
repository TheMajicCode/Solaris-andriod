package L5;

import android.content.DialogInterface;
import android.content.DialogInterface$OnClickListener;
import android.widget.EditText;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class u implements DialogInterface$OnClickListener {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ EditText f1858f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ EditText f1859g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Function1 f1860h;

    public /* synthetic */ u(EditText editText, EditText editText2, Function1 function1) {
        this.f1858f = editText;
        this.f1859g = editText2;
        this.f1860h = function1;
    }

    @Override // android.content.DialogInterface$OnClickListener
    public final void onClick(DialogInterface dialogInterface, int i6) {
        y.e(this.f1858f, this.f1859g, this.f1860h, dialogInterface, i6);
    }
}
