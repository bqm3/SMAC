import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import adjust from "../../constants/adjust";
import QRCodeScreen from "./QrCodeScreen";

const ScanScreen = () => {
  const [isScan, setIsScan] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);

  const toggleModalQr = (check, value) => {
    setModalVisibleQr(check);
    setOpacity(value);
  };

  const handlePushDataFilterQr = async (value) => {
    const cleanedValue = value
      .replace(/^http:\/\//, "")
      .trim()
      .toLowerCase();
    if (cleanedValue === "hihi") {
      console.log("data");
    } else {
      Alert.alert(
        "PMC Thông báo",
        "Sản phẩm không có trong danh sách cần kiểm kê",
        [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]
      );
      toggleModalQr(false, 1);
    }

    // try {
    //   const resData = ent_khuvuc.filter(
    //     (item) => item.MaQrCode.trim().toLowerCase() === cleanedValue
    //   );
    //   if (resData.length >= 1) {
    //     navigation.navigate("Thực hiện hạng mục", {
    //       ID_ChecklistC: ID_ChecklistC,
    //       ID_KhoiCV: ID_KhoiCV,
    //       ID_Calv: ID_Calv,
    //       ID_Khuvuc: resData[0].ID_Khuvuc,
    //     });
    //     setIsScan(false);
    //     setModalVisibleQr(false);
    //     setOpacity(1);
    //   } else if (resData.length === 0) {
    //     Alert.alert(
    //       "PMC Thông báo",
    //       "Không tìm thấy khu vực có mã Qr phù hợp",
    //       [
    //         {
    //           text: "Hủy",
    //           onPress: () => console.log("Cancel Pressed"),
    //           style: "cancel",
    //         },
    //         { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
    //       ]
    //     );
    //     setIsScan(false);
    //     setModalVisibleQr(false);
    //     setOpacity(1);
    //   }
    // } catch (error) {
    //   if (error.response) {
    //     // Lỗi từ phía server (có response từ server)
    //     Alert.alert("PMC Thông báo", error.response.data.message, [
    //       {
    //         text: "Hủy",
    //         onPress: () => console.log("Cancel Pressed"),
    //         style: "cancel",
    //       },
    //       { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
    //     ]);
    //   } else if (error.request) {
    //     // Lỗi không nhận được phản hồi từ server
    //     Alert.alert("PMC Thông báo", "Không nhận được phản hồi từ máy chủ", [
    //       {
    //         text: "Hủy",
    //         onPress: () => console.log("Cancel Pressed"),
    //         style: "cancel",
    //       },
    //       { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
    //     ]);
    //   } else {
    //     // Lỗi khi cấu hình request
    //     Alert.alert("PMC Thông báo", "Lỗi khi gửi yêu cầu", [
    //       {
    //         text: "Hủy",
    //         onPress: () => console.log("Cancel Pressed"),
    //         style: "cancel",
    //       },
    //       { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
    //     ]);
    //   }
    // }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <View
              style={[
                styles.container,
                {
                  opacity: opacity,
                  backgroundColor: modalVisibleQr ? "black" : "white",
                  zIndex: 10,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  position: "absolute",
                  top: 80,
                }}
              >
                Quản lý tài sản
              </Text>
              {modalVisibleQr === false && (
                <View>
                  <TouchableOpacity onPress={() => toggleModalQr(true, 0.6)}>
                    <Image
                      style={{
                        width: adjust(300),
                        height: adjust(300),
                        resizeMode: "contain",
                      }}
                      source={require("../../../assets/images/scan.png")}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      paddingTop: 10,
                      textAlign: "center",
                    }}
                  >
                    Ấn vào Qr để Quét 
                  </Text>
                </View>
              )}
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleQr}
              onRequestClose={() => toggleModalQr(false, 1)}
            >
              {modalVisibleQr === true && (
                <TouchableOpacity
                  onPress={() => toggleModalQr(false, 1)}
                  style={{
                    position: "relative",
                    top: 60,
                    left: 30,
                    zIndex: 100,
                    width: 40,
                  }}
                >
                  <AntDesign name="closecircle" size={36} color="white" />
                </TouchableOpacity>
              )}
              <View
                style={[styles.centeredView, { width: "100%", height: "80%" }]}
              >
                <View
                  style={[
                    styles.modalView,
                    { width: adjust(320), height: adjust(320) },
                  ]}
                >
                  <QRCodeScreen
                    // setModalVisibleQr={setModalVisibleQr}
                    // setOpacity={setOpacity}
                    handlePushDataFilterQr={handlePushDataFilterQr}
                    setIsScan={setIsScan}
                  />
                </View>

                <Text style={{ color: "white", fontSize: 16, paddingTop: 10 }}>
                  Hướng camera về phía mã qrcode
                </Text>
              </View>
            </Modal>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },
  modalView: {
    margin: 20,
    borderRadius: 16,
    // padding: 10,
  },
});
