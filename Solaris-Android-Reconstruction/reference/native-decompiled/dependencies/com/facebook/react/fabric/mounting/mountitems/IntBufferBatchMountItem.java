package com.facebook.react.fabric.mounting.mountitems;

import E1.c;
import E1.e;
import F1.a;
import F1.f;
import J1.b;
import J3.F;
import J3.l;
import com.facebook.react.bridge.ReactMarker;
import com.facebook.react.bridge.ReactMarkerConstants;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.fabric.FabricUIManager;
import com.facebook.react.fabric.events.EventEmitterWrapper;
import com.facebook.react.uimanager.InterfaceC0640h0;
import java.util.Arrays;
import java.util.Locale;
import kotlin.Metadata;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
@Metadata(d1 = {"\u0000>\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u0015\n\u0000\n\u0002\u0010\u0011\n\u0002\u0010\u0000\n\u0002\b\u0004\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u000b\n\u0002\b\f\b\u0001\u0018\u0000 #2\u00020\u0001:\u0001$B/\u0012\u0006\u0010\u0003\u001a\u00020\u0002\u0012\u0006\u0010\u0005\u001a\u00020\u0004\u0012\u000e\u0010\b\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u00070\u0006\u0012\u0006\u0010\t\u001a\u00020\u0002¢\u0006\u0004\b\n\u0010\u000bJ\u0017\u0010\u000f\u001a\u00020\u000e2\u0006\u0010\r\u001a\u00020\fH\u0002¢\u0006\u0004\b\u000f\u0010\u0010J\u000f\u0010\u0011\u001a\u00020\u000eH\u0002¢\u0006\u0004\b\u0011\u0010\u0012J\u0017\u0010\u0015\u001a\u00020\u000e2\u0006\u0010\u0014\u001a\u00020\u0013H\u0016¢\u0006\u0004\b\u0015\u0010\u0016J\u000f\u0010\u0017\u001a\u00020\u0002H\u0016¢\u0006\u0004\b\u0017\u0010\u0018J\u000f\u0010\u001a\u001a\u00020\u0019H\u0016¢\u0006\u0004\b\u001a\u0010\u001bJ\u000f\u0010\u001c\u001a\u00020\fH\u0016¢\u0006\u0004\b\u001c\u0010\u001dR\u0014\u0010\u0003\u001a\u00020\u00028\u0002X\u0082\u0004¢\u0006\u0006\n\u0004\b\u0003\u0010\u001eR\u0014\u0010\u0005\u001a\u00020\u00048\u0002X\u0082\u0004¢\u0006\u0006\n\u0004\b\u0005\u0010\u001fR\u001c\u0010\b\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u00070\u00068\u0002X\u0082\u0004¢\u0006\u0006\n\u0004\b\b\u0010 R\u0014\u0010\t\u001a\u00020\u00028\u0002X\u0082\u0004¢\u0006\u0006\n\u0004\b\t\u0010\u001eR\u0014\u0010!\u001a\u00020\u00028\u0002X\u0082\u0004¢\u0006\u0006\n\u0004\b!\u0010\u001eR\u0014\u0010\"\u001a\u00020\u00028\u0002X\u0082\u0004¢\u0006\u0006\n\u0004\b\"\u0010\u001e¨\u0006%"}, d2 = {"Lcom/facebook/react/fabric/mounting/mountitems/IntBufferBatchMountItem;", "LF1/a;", "", "surfaceId", "", "intBuffer", "", "", "objBuffer", "commitNumber", "<init>", "(I[I[Ljava/lang/Object;I)V", "", "reason", "Lu3/A;", "beginMarkers", "(Ljava/lang/String;)V", "endMarkers", "()V", "LE1/c;", "mountingManager", "execute", "(LE1/c;)V", "getSurfaceId", "()I", "", "isBatchEmpty", "()Z", "toString", "()Ljava/lang/String;", "I", "[I", "[Ljava/lang/Object;", "intBufferLen", "objBufferLen", "Companion", "a", "ReactAndroid_release"}, k = 1, mv = {2, 1, 0}, xi = 48)
public final class IntBufferBatchMountItem implements a {
    public static final IntBufferBatchMountItem$a Companion = new IntBufferBatchMountItem$a(null);
    public static final int INSTRUCTION_CREATE = 2;
    public static final int INSTRUCTION_DELETE = 4;
    public static final int INSTRUCTION_FLAG_MULTIPLE = 1;
    public static final int INSTRUCTION_INSERT = 8;
    public static final int INSTRUCTION_REMOVE = 16;
    public static final int INSTRUCTION_UPDATE_EVENT_EMITTER = 256;
    public static final int INSTRUCTION_UPDATE_LAYOUT = 128;
    public static final int INSTRUCTION_UPDATE_OVERFLOW_INSET = 1024;
    public static final int INSTRUCTION_UPDATE_PADDING = 512;
    public static final int INSTRUCTION_UPDATE_PROPS = 32;
    public static final int INSTRUCTION_UPDATE_STATE = 64;
    private static final String TAG;
    private final int commitNumber;
    private final int[] intBuffer;
    private final int intBufferLen;
    private final Object[] objBuffer;
    private final int objBufferLen;
    private final int surfaceId;

    static {
        String simpleName = IntBufferBatchMountItem.class.getSimpleName();
        l.e(simpleName, "getSimpleName(...)");
        TAG = simpleName;
    }

    public IntBufferBatchMountItem(int i6, int[] iArr, Object[] objArr, int i7) {
        l.f(iArr, "intBuffer");
        l.f(objArr, "objBuffer");
        this.surfaceId = i6;
        this.intBuffer = iArr;
        this.objBuffer = objArr;
        this.commitNumber = i7;
        this.intBufferLen = iArr.length;
        this.objBufferLen = objArr.length;
    }

    public static final /* synthetic */ String access$getTAG$cp() {
        return TAG;
    }

    private final void beginMarkers(String reason) {
        p142v2.a.c(0L, "IntBufferBatchMountItem::" + reason);
        int i6 = this.commitNumber;
        if (i6 > 0) {
            ReactMarker.logFabricMarker(ReactMarkerConstants.FABRIC_BATCH_EXECUTION_START, null, i6);
        }
    }

    private final void endMarkers() {
        int i6 = this.commitNumber;
        if (i6 > 0) {
            ReactMarker.logFabricMarker(ReactMarkerConstants.FABRIC_BATCH_EXECUTION_END, null, i6);
        }
        p142v2.a.i(0L);
    }

    @Override // com.facebook.react.fabric.mounting.mountitems.MountItem
    public void execute(c mountingManager) {
        int i6;
        int i7;
        int i8;
        int i9;
        l.f(mountingManager, "mountingManager");
        e eVarF = mountingManager.f(this.surfaceId);
        if (eVarF == null) {
            Y.a.o(TAG, "Skipping batch of MountItems; no SurfaceMountingManager found for [%d].", Integer.valueOf(this.surfaceId));
            return;
        }
        if (eVarF.w()) {
            Y.a.o(TAG, "Skipping batch of MountItems; was stopped [%d].", Integer.valueOf(this.surfaceId));
            return;
        }
        if (b.i()) {
            Y.a.c(TAG, "Executing IntBufferBatchMountItem on surface [%d]", Integer.valueOf(this.surfaceId));
        }
        beginMarkers("mountViews");
        int i10 = 0;
        int i11 = 0;
        while (i10 < this.intBufferLen) {
            int[] iArr = this.intBuffer;
            int i12 = i10 + 1;
            int i13 = iArr[i10];
            int i14 = i13 & (-2);
            if ((i13 & 1) != 0) {
                int i15 = iArr[i12];
                i12 = i10 + 2;
                i6 = i15;
            } else {
                i6 = 1;
            }
            int i16 = 2;
            p142v2.a.d(0L, "IntBufferBatchMountItem::mountInstructions::" + IntBufferBatchMountItem$a.a(Companion, i14), new String[]{"numInstructions", String.valueOf(i6)}, 2);
            int i17 = 0;
            int i18 = i11;
            while (i17 < i6) {
                if (i14 == i16) {
                    i16 = i16;
                    i17 = i17;
                    int i19 = i18 + 1;
                    String str = (String) this.objBuffer[i18];
                    if (str == null) {
                        str = "";
                    }
                    String strA = f.a(str);
                    int[] iArr2 = this.intBuffer;
                    int i20 = iArr2[i12];
                    Object[] objArr = this.objBuffer;
                    ReadableMap readableMap = (ReadableMap) objArr[i19];
                    int i21 = i18 + 3;
                    InterfaceC0640h0 interfaceC0640h0 = (InterfaceC0640h0) objArr[i18 + 2];
                    i18 += 4;
                    EventEmitterWrapper eventEmitterWrapper = (EventEmitterWrapper) objArr[i21];
                    int i22 = i12 + 2;
                    eVarF.i(strA, i20, readableMap, interfaceC0640h0, eventEmitterWrapper, iArr2[i12 + 1] == 1);
                    i12 = i22;
                } else if (i14 == 4) {
                    i16 = i16;
                    i17 = i17;
                    eVarF.k(this.intBuffer[i12]);
                    i12++;
                } else if (i14 == 8) {
                    i16 = i16;
                    i17 = i17;
                    int[] iArr3 = this.intBuffer;
                    int i23 = iArr3[i12];
                    int i24 = i12 + 2;
                    int i25 = iArr3[i12 + 1];
                    i12 += 3;
                    eVarF.g(i25, i23, iArr3[i24]);
                } else if (i14 != 16) {
                    if (i14 == 32) {
                        i7 = i12 + 1;
                        i8 = i18 + 1;
                        eVarF.P(this.intBuffer[i12], (ReadableMap) this.objBuffer[i18]);
                    } else if (i14 == 64) {
                        i7 = i12 + 1;
                        i8 = i18 + 1;
                        eVarF.Q(this.intBuffer[i12], (InterfaceC0640h0) this.objBuffer[i18]);
                    } else if (i14 == 128) {
                        int[] iArr4 = this.intBuffer;
                        i16 = i16;
                        i17 = i17;
                        eVarF.M(iArr4[i12], iArr4[i12 + 1], iArr4[i12 + 2], iArr4[i12 + 3], iArr4[i12 + 4], iArr4[i12 + 5], iArr4[i12 + 6], iArr4[i12 + 7]);
                        i12 += 8;
                    } else if (i14 != 256) {
                        if (i14 == 512) {
                            int[] iArr5 = this.intBuffer;
                            i9 = i12 + 5;
                            eVarF.O(iArr5[i12], iArr5[i12 + 1], iArr5[i12 + 2], iArr5[i12 + 3], iArr5[i12 + 4]);
                        } else {
                            if (i14 != 1024) {
                                throw new IllegalArgumentException("Invalid type argument to IntBufferBatchMountItem: " + i14 + " at index: " + i12);
                            }
                            int[] iArr6 = this.intBuffer;
                            i9 = i12 + 5;
                            eVarF.N(iArr6[i12], iArr6[i12 + 1], iArr6[i12 + 2], iArr6[i12 + 3], iArr6[i12 + 4]);
                        }
                        i17 = i17;
                        i12 = i9;
                        i16 = i16;
                    } else {
                        i18++;
                        EventEmitterWrapper eventEmitterWrapper2 = (EventEmitterWrapper) this.objBuffer[i18];
                        if (eventEmitterWrapper2 != null) {
                            eVarF.L(this.intBuffer[i12], eventEmitterWrapper2);
                            i12++;
                        }
                        i16 = i16;
                        i17 = i17;
                    }
                    i12 = i7;
                    i18 = i8;
                } else {
                    i16 = i16;
                    i17 = i17;
                    int[] iArr7 = this.intBuffer;
                    int i26 = iArr7[i12];
                    int i27 = i12 + 2;
                    int i28 = iArr7[i12 + 1];
                    i12 += 3;
                    eVarF.F(i26, i28, iArr7[i27]);
                }
                i17++;
                i16 = i16;
            }
            p142v2.a.i(0L);
            i10 = i12;
            i11 = i18;
        }
        endMarkers();
    }

    @Override // com.facebook.react.fabric.mounting.mountitems.MountItem
    public int getSurfaceId() {
        return this.surfaceId;
    }

    @Override // F1.a
    public boolean isBatchEmpty() {
        return this.intBufferLen == 0;
    }

    public String toString() {
        int i6;
        int i7;
        int i8;
        int i9;
        try {
            StringBuilder sb = new StringBuilder();
            F f6 = F.f1204a;
            int i10 = 1;
            String str = String.format(Locale.ROOT, "IntBufferBatchMountItem [surface:%d]:\n", Arrays.copyOf(new Object[]{Integer.valueOf(this.surfaceId)}, 1));
            l.e(str, "format(...)");
            sb.append(str);
            int i11 = 0;
            int i12 = 0;
            while (i11 < this.intBufferLen) {
                int[] iArr = this.intBuffer;
                int i13 = i11 + 1;
                int i14 = iArr[i11];
                int i15 = i14 & (-2);
                if ((i14 & i10) != 0) {
                    int i16 = i11 + 2;
                    i6 = iArr[i13];
                    i13 = i16;
                } else {
                    i6 = i10;
                }
                i11 = i13;
                int i17 = 0;
                while (i17 < i6) {
                    if (i15 != 2) {
                        if (i15 == 4) {
                            F f7 = F.f1204a;
                            i7 = i11 + 1;
                            String str2 = String.format(Locale.ROOT, "DELETE [%d]\n", Arrays.copyOf(new Object[]{Integer.valueOf(this.intBuffer[i11])}, 1));
                            l.e(str2, "format(...)");
                            sb.append(str2);
                        } else if (i15 == 8) {
                            F f8 = F.f1204a;
                            Locale locale = Locale.ROOT;
                            Integer numValueOf = Integer.valueOf(this.intBuffer[i11]);
                            int i18 = i11 + 2;
                            Integer numValueOf2 = Integer.valueOf(this.intBuffer[i11 + 1]);
                            i11 += 3;
                            String str3 = String.format(locale, "INSERT [%d]->[%d] @%d\n", Arrays.copyOf(new Object[]{numValueOf, numValueOf2, Integer.valueOf(this.intBuffer[i18])}, 3));
                            l.e(str3, "format(...)");
                            sb.append(str3);
                        } else if (i15 != 16) {
                            String string = "<hidden>";
                            if (i15 == 32) {
                                i8 = i12 + 1;
                                Object obj = this.objBuffer[i12];
                                if (FabricUIManager.IS_DEVELOPMENT_ENVIRONMENT && (obj == null || (string = obj.toString()) == null)) {
                                    string = "<null>";
                                }
                                F f9 = F.f1204a;
                                i9 = i11 + 1;
                                String str4 = String.format(Locale.ROOT, "UPDATE PROPS [%d]: %s\n", Arrays.copyOf(new Object[]{Integer.valueOf(this.intBuffer[i11]), string}, 2));
                                l.e(str4, "format(...)");
                                sb.append(str4);
                            } else if (i15 == 64) {
                                i8 = i12 + 1;
                                InterfaceC0640h0 interfaceC0640h0 = (InterfaceC0640h0) this.objBuffer[i12];
                                if (FabricUIManager.IS_DEVELOPMENT_ENVIRONMENT && (interfaceC0640h0 == null || (string = interfaceC0640h0.toString()) == null)) {
                                    string = "<null>";
                                }
                                F f10 = F.f1204a;
                                i9 = i11 + 1;
                                String str5 = String.format(Locale.ROOT, "UPDATE STATE [%d]: %s\n", Arrays.copyOf(new Object[]{Integer.valueOf(this.intBuffer[i11]), string}, 2));
                                l.e(str5, "format(...)");
                                sb.append(str5);
                            } else if (i15 == 128) {
                                F f11 = F.f1204a;
                                Locale locale2 = Locale.ROOT;
                                Integer numValueOf3 = Integer.valueOf(this.intBuffer[i11]);
                                Integer numValueOf4 = Integer.valueOf(this.intBuffer[i11 + 1]);
                                Integer numValueOf5 = Integer.valueOf(this.intBuffer[i11 + 2]);
                                Integer numValueOf6 = Integer.valueOf(this.intBuffer[i11 + 3]);
                                Integer numValueOf7 = Integer.valueOf(this.intBuffer[i11 + 4]);
                                Integer numValueOf8 = Integer.valueOf(this.intBuffer[i11 + 5]);
                                int i19 = i11 + 7;
                                Integer numValueOf9 = Integer.valueOf(this.intBuffer[i11 + 6]);
                                i11 += 8;
                                String str6 = String.format(locale2, "UPDATE LAYOUT [%d]->[%d]: x:%d y:%d w:%d h:%d displayType:%d layoutDirection:%d\n", Arrays.copyOf(new Object[]{numValueOf3, numValueOf4, numValueOf5, numValueOf6, numValueOf7, numValueOf8, numValueOf9, Integer.valueOf(this.intBuffer[i19])}, 8));
                                l.e(str6, "format(...)");
                                sb.append(str6);
                            } else if (i15 == 256) {
                                i12++;
                                F f12 = F.f1204a;
                                i7 = i11 + 1;
                                String str7 = String.format(Locale.ROOT, "UPDATE EVENTEMITTER [%d]\n", Arrays.copyOf(new Object[]{Integer.valueOf(this.intBuffer[i11])}, 1));
                                l.e(str7, "format(...)");
                                sb.append(str7);
                            } else if (i15 == 512) {
                                F f13 = F.f1204a;
                                Locale locale3 = Locale.ROOT;
                                Integer numValueOf10 = Integer.valueOf(this.intBuffer[i11]);
                                Integer numValueOf11 = Integer.valueOf(this.intBuffer[i11 + 1]);
                                Integer numValueOf12 = Integer.valueOf(this.intBuffer[i11 + 2]);
                                int i20 = i11 + 4;
                                Integer numValueOf13 = Integer.valueOf(this.intBuffer[i11 + 3]);
                                i11 += 5;
                                String str8 = String.format(locale3, "UPDATE PADDING [%d]: top:%d right:%d bottom:%d left:%d\n", Arrays.copyOf(new Object[]{numValueOf10, numValueOf11, numValueOf12, numValueOf13, Integer.valueOf(this.intBuffer[i20])}, 5));
                                l.e(str8, "format(...)");
                                sb.append(str8);
                            } else {
                                if (i15 != 1024) {
                                    Y.a.m(TAG, "String so far: " + ((Object) sb));
                                    throw new IllegalArgumentException("Invalid type argument to IntBufferBatchMountItem: " + i15 + " at index: " + i11);
                                }
                                F f14 = F.f1204a;
                                Locale locale4 = Locale.ROOT;
                                Integer numValueOf14 = Integer.valueOf(this.intBuffer[i11]);
                                Integer numValueOf15 = Integer.valueOf(this.intBuffer[i11 + 1]);
                                Integer numValueOf16 = Integer.valueOf(this.intBuffer[i11 + 2]);
                                int i21 = i11 + 4;
                                Integer numValueOf17 = Integer.valueOf(this.intBuffer[i11 + 3]);
                                i11 += 5;
                                String str9 = String.format(locale4, "UPDATE OVERFLOWINSET [%d]: left:%d top:%d right:%d bottom:%d\n", Arrays.copyOf(new Object[]{numValueOf14, numValueOf15, numValueOf16, numValueOf17, Integer.valueOf(this.intBuffer[i21])}, 5));
                                l.e(str9, "format(...)");
                                sb.append(str9);
                            }
                            i12 = i8;
                            i11 = i9;
                        } else {
                            F f15 = F.f1204a;
                            Locale locale5 = Locale.ROOT;
                            Integer numValueOf18 = Integer.valueOf(this.intBuffer[i11]);
                            int i22 = i11 + 2;
                            Integer numValueOf19 = Integer.valueOf(this.intBuffer[i11 + 1]);
                            i11 += 3;
                            String str10 = String.format(locale5, "REMOVE [%d]->[%d] @%d\n", Arrays.copyOf(new Object[]{numValueOf18, numValueOf19, Integer.valueOf(this.intBuffer[i22])}, 3));
                            l.e(str10, "format(...)");
                            sb.append(str10);
                        }
                        i11 = i7;
                    } else {
                        String str11 = (String) this.objBuffer[i12];
                        if (str11 == null) {
                            str11 = "";
                        }
                        String strA = f.a(str11);
                        i12 += 4;
                        F f16 = F.f1204a;
                        Locale locale6 = Locale.ROOT;
                        int i23 = i11 + 1;
                        Integer numValueOf20 = Integer.valueOf(this.intBuffer[i11]);
                        i11 += 2;
                        String str12 = String.format(locale6, "CREATE [%d] - layoutable:%d - %s\n", Arrays.copyOf(new Object[]{numValueOf20, Integer.valueOf(this.intBuffer[i23]), strA}, 3));
                        l.e(str12, "format(...)");
                        sb.append(str12);
                    }
                    i17++;
                    i10 = 1;
                }
            }
            String string2 = sb.toString();
            l.e(string2, "toString(...)");
            return string2;
        } catch (Exception e6) {
            Y.a.n(TAG, "Caught exception trying to print", e6);
            StringBuilder sb2 = new StringBuilder();
            for (int i24 = 0; i24 < this.intBufferLen; i24++) {
                sb2.append(this.intBuffer[i24]);
                sb2.append(", ");
            }
            Y.a.m(TAG, sb2.toString());
            for (int i25 = 0; i25 < this.objBufferLen; i25++) {
                String str13 = TAG;
                Object obj2 = this.objBuffer[i25];
                Y.a.m(str13, obj2 != null ? String.valueOf(obj2) : "null");
            }
            return "";
        }
    }
}
