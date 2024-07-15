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
import React, { useEffect, useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import adjust from "../../constants/adjust";
import QRCodeScreen from "./QrCodeScreen";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import ButtonScan from "../../components/Button/ButtonScan";

const ScanScreen = () => {
  const [isScan, setIsScan] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [modalVisisbleTaiSan, setModalVisibleTaiSan] = useState(false);
  const [image, setImage] = useState();

  const [taisanQr, setTaiSanQr] = useState([]);
  const [dataTaiSanDetail, setDataTaiSanDetail] = useState(null);

  const pickImage = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setImage(result?.assets[0]);
    }
  };

  useEffect(() => {
    async function fetchDataTaiSan() {
      const res = await axios.get(
        "https://checklist.pmcweb.vn/pmc-assets/api/tb_taisanqrcode/all"
      );
      if (res.status == 200) {
        setTaiSanQr(res.data.data);
      } else {
        setTaiSanQr([]);
      }
    }
    fetchDataTaiSan();
  }, []);

  const toggleModalQr = (check, value) => {
    setModalVisibleQr(check);
    setOpacity(value);
  };

  const toggleModalTaiSanQr = (check, value) => {
    setModalVisibleTaiSan(check);
    setOpacity(value);
  };

  const clearDataModal = () => {
    setImage();
    setDataTaiSanDetail();
  };

  function formatDate(dateString) {
    // Check if dateString is defined and not null
    if (!dateString) {
      return ""; // or any default value you want to return in case of invalid input
    }

    // Split the input date string by the hyphen (-)
    let dateParts = dateString.split("-");

    // Rearrange the date parts to dd-mm-yyyy
    let formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    return formattedDate;
  }

  const handlePushDataFilterQr = async (value) => {
    const cleanedValue = value
      .replace(/^http:\/\//, "")
      .trim()
      .toLowerCase();
    if (cleanedValue) {
      const resData = taisanQr.filter(
        (item) => item.MaQrCode.trim().toLowerCase() === cleanedValue
      );
      if (resData.length >= 1) {
        setDataTaiSanDetail(resData[0]);
        setIsScan(false);
        setModalVisibleQr(false);
        setModalVisibleTaiSan(true);
        setOpacity(0.4);
      }
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
                  backgroundColor:
                    modalVisibleQr || modalVisisbleTaiSan ? "black" : "white",
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
              {modalVisibleQr === false && modalVisisbleTaiSan === false && (
                <View>
                  <TouchableOpacity onPress={() => toggleModalQr(true, 0.4)}>
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
              onRequestClose={() => {
                toggleModalQr(false, 1);
                clearDataModal();
              }}
            >
              {modalVisibleQr === true && (
                <TouchableOpacity
                  onPress={() => {
                    toggleModalQr(false, 1);
                    clearDataModal();
                  }}
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
                    handlePushDataFilterQr={handlePushDataFilterQr}
                    setIsScan={setIsScan}
                  />
                </View>

                <Text style={{ color: "white", fontSize: 16, paddingTop: 10 }}>
                  Hướng camera về phía mã qrcode
                </Text>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisisbleTaiSan}
              onRequestClose={() => {
                toggleModalTaiSanQr(false, 1);
                clearDataModal();
              }}
            >
              {modalVisisbleTaiSan === true && (
                <TouchableOpacity
                  onPress={() => {
                    toggleModalTaiSanQr(false, 1);
                    clearDataModal();
                  }}
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
              <View style={[styles.centeredView]}>
                <View
                  style={[
                    styles.modalViewInfo,
                    {
                      width: "85%",
                      height: "auto",
                    },
                  ]}
                >
                  <View style={styles.headerModal}>
                    <Text allowFontScaling={false} style={styles.textModal}>
                      Xác nhận thông tin
                    </Text>
                  </View>
                  <View style={{ paddingVertical: 20 }}>
                    <Text
                      allowFontScaling={false}
                      style={[styles.textModal, { textAlign: "center" }]}
                    >
                      Thực hiện kiểm hàng{" "}
                      <Text style={{ fontWeight: "700" }}>
                        {dataTaiSanDetail?.ent_taisan?.Tents} asdf asdf asdf df
                        asdfasd fadfa dfd
                      </Text>
                    </Text>

                    <View style={{ marginTop: 30 }}>
                      <View style={{ flexDirection: "row", marginBottom: 10 }}>
                        <Text style={{ width: 100, fontWeight: "600" }}>
                          Ngày khởi tạo
                        </Text>
                        <Text>:</Text>
                        <Text>
                          {" "}
                          {formatDate(dataTaiSanDetail?.Ngaykhoitao)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginBottom: 10 }}>
                        <Text style={{ width: 100, fontWeight: "600" }}>
                          Giá trị
                        </Text>
                        <Text>:</Text>
                        <Text>
                          {" "}
                          {dataTaiSanDetail?.Giatri.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginBottom: 10 }}>
                        <Text style={{ width: 100, fontWeight: "600" }}>
                          Tình trạng
                        </Text>
                        <Text>:</Text>
                        <Text>
                          {" "}
                          {dataTaiSanDetail?.iTinhtrang === 0 && "Sử dụng"}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginBottom: 10 }}>
                        <Text style={{ width: 100, fontWeight: "600" }}>
                          Người tạo
                        </Text>
                        <Text>:</Text>
                        <Text> {dataTaiSanDetail?.ent_userChecklist?.Hoten}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          marginBottom: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <Text style={{ width: 100, fontWeight: "600" }}>
                          Phòng ban
                        </Text>
                        <Text>:</Text>
                        <Text style={{ flexShrink: 1 }}>
                          {" "}
                          {dataTaiSanDetail?.ent_phongbanda?.Tenphongban} (
                          {
                            dataTaiSanDetail?.ent_phongbanda?.ent_chinhanh
                              .Tenchinhanh
                          }
                          )
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 10,
                      gap: 20,
                    }}
                  >
                    <ButtonScan
                      width={"49%"}
                      text={"Chụp ảnh"}
                      backgroundColor={"#326BFF"}
                      color={"#FFFFFF"}
                      onPress={() => pickImage()}
                    />
                    {image ? (
                      <ButtonScan
                        width={"49%"}
                        text={"Xác nhận"}
                        backgroundColor={"#326BFF"}
                        color={"#FFFFFF"}
                        onPress={() => toggleModalTaiSanQr(false, 1)}
                      />
                    ) : (
                      <ButtonScan
                        width={"49%"}
                        text={"Đóng"}
                        backgroundColor={"#DCDEE9"}
                        color={"#7E7C7C"}
                        onPress={() => toggleModalTaiSanQr(false, 1)}
                      />
                    )}
                  </View>
                </View>
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },

  modalViewInfo: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  headerModal: {
    width: "100%",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    alignItems: "center",
    padding: 10,
  },

  textModal: {
    color: "#21409A",
    paddingBottom: 4,
    fontWeight: "500",
  },
});
