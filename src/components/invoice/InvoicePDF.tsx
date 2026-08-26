import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, Svg, Path } from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/invoice/utils';

// Register fonts if needed, but Helvetica is built-in.
// We will use standard Helvetica and Helvetica-Bold.

const PRIMARY_RED = '#990000'; // Darker red to match logo
const TEXT_DARK = '#1A1A1A';
const TEXT_LIGHT = '#666666';
const BORDER_COLOR = '#E5E7EB';

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    fontSize: 10,
    color: TEXT_DARK,
  },
  // --- BACKGROUND/DECORATIVE ---
  topBgCurve: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: PRIMARY_RED,
  },
  bottomBgCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: PRIMARY_RED,
  },
  bottomBgCurveBlack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#000000',
  },
  container: {
    paddingTop: 25,
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  // --- HEADER ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '65%',
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  logoPlaceholder: {
    color: PRIMARY_RED,
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  companyInfo: {
    flex: 1,
  },
  companyName1: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.1,
  },
  companyName2: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY_RED,
    lineHeight: 1.1,
  },
  companyTagline: {
    fontSize: 8,
    color: TEXT_LIGHT,
    marginTop: 4,
    marginBottom: 8,
    letterSpacing: 1,
  },
  companyContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  companyContactText: {
    fontSize: 9,
    color: TEXT_DARK,
    marginLeft: 6,
    width: '90%',
  },
  headerRight: {
    width: '32%',
    alignItems: 'flex-end',
  },
  invoiceTitleBox: {
    backgroundColor: PRIMARY_RED,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
  },
  invoiceTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Helvetica-BoldOblique',
    letterSpacing: 1,
  },
  invoiceMetaBox: {
    width: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 8.5,
    color: TEXT_LIGHT,
    width: '48%',
  },
  metaValue: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    width: '52%',
    textAlign: 'left',
  },
  // --- 2 COLUMNS: DITERBITKAN UNTUK & DETAIL PAKET ---
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: PRIMARY_RED,
    borderRadius: 8,
    padding: 12,
  },
  infoBoxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoBoxTitle: {
    color: PRIMARY_RED,
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    width: '35%',
    fontSize: 9,
    color: TEXT_LIGHT,
  },
  infoColon: {
    width: '5%',
    fontSize: 9,
    color: TEXT_LIGHT,
  },
  infoValue: {
    width: '60%',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  // --- TABLE ---
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: PRIMARY_RED,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_RED,
    paddingVertical: 8,
  },
  thNo: { width: '8%', textAlign: 'center', color: '#FFF', fontFamily: 'Helvetica-Bold', fontSize: 9 },
  thDesc: { width: '40%', textAlign: 'left', color: '#FFF', fontFamily: 'Helvetica-Bold', fontSize: 9, paddingLeft: 10 },
  thQty: { width: '17%', textAlign: 'center', color: '#FFF', fontFamily: 'Helvetica-Bold', fontSize: 9 },
  thPrice: { width: '17.5%', textAlign: 'left', color: '#FFF', fontFamily: 'Helvetica-Bold', fontSize: 9, paddingLeft: 5 },
  thTotal: { width: '17.5%', textAlign: 'left', color: '#FFF', fontFamily: 'Helvetica-Bold', fontSize: 9, paddingLeft: 5 },
  
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    borderBottomStyle: 'dashed',
    paddingVertical: 12,
  },
  tdNo: { width: '8%', textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 9 },
  tdDesc: { width: '40%', textAlign: 'left', fontFamily: 'Helvetica-Bold', fontSize: 9, paddingLeft: 10 },
  tdQtyBox: { width: '17%', alignItems: 'center' },
  tdQty: { fontFamily: 'Helvetica-Bold', fontSize: 9, marginBottom: 4 },
  tdQtySub: { color: TEXT_LIGHT, fontSize: 8 },
  tdPrice: { width: '17.5%', textAlign: 'left', fontSize: 9, paddingLeft: 5 },
  tdTotal: { width: '17.5%', textAlign: 'left', fontSize: 9, paddingLeft: 5 },

  // --- BOTTOM SECTION ---
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bottomLeft: {
    width: '45%',
  },
  bottomRight: {
    width: '50%',
  },
  // Payment Info
  paymentInfoBox: {
    borderWidth: 1,
    borderColor: PRIMARY_RED,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  paymentLabel: {
    width: '44%',
    fontSize: 8.5,
    color: TEXT_LIGHT,
  },
  paymentColon: {
    width: '4%',
    fontSize: 8.5,
    color: TEXT_LIGHT,
  },
  paymentValue: {
    width: '52%',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },
  // Notes / Footer Info inline
  footerText: {
    fontSize: 9,
    color: TEXT_DARK,
    lineHeight: 1.4,
    marginBottom: 8,
  },
  footerThanks: {
    fontSize: 9,
    fontFamily: 'Helvetica-BoldOblique',
  },
  
  // Summary
  summaryBox: {
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  summaryColon: {
    color: '#FFFFFF',
    fontSize: 10,
    marginHorizontal: 10,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 10,
    flex: 1,
    textAlign: 'left',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 8,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  summaryLabelTotal: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  summaryValueTotal: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
    textAlign: 'left',
  },
  
  // Big Total Box
  bigTotalBox: {
    backgroundColor: PRIMARY_RED,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  bigTotalLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  bigTotalValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },

  // Status Box
  statusBox: {
    borderWidth: 1,
    borderColor: PRIMARY_RED,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  statusLabel: {
    color: PRIMARY_RED,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  statusValueBox: {
    borderWidth: 1,
    borderColor: PRIMARY_RED,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  statusValue: {
    color: PRIMARY_RED,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },

  // --- SIGNATURE / END FOOTER ---
  thankYouArea: {
    alignItems: 'center',
    marginTop: 10,
  },
  thankYouText: {
    color: PRIMARY_RED,
    fontSize: 24,
    fontFamily: 'Helvetica-BoldOblique',
    marginBottom: 4,
  },
  thankYouSub: {
    color: TEXT_DARK,
    fontSize: 9,
    letterSpacing: 2,
    fontFamily: 'Helvetica-Bold',
  }
});

// SVG Icons
const IconLocation = () => (
  <Svg viewBox="0 0 24 24" width={10} height={10}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={PRIMARY_RED} />
  </Svg>
);
const IconIG = () => (
  <Svg viewBox="0 0 24 24" width={10} height={10}>
    <Path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.4 5.6 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.6 18.4 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" fill={PRIMARY_RED}/>
  </Svg>
);
const IconWA = () => (
  <Svg viewBox="0 0 24 24" width={10} height={10}>
    <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill={PRIMARY_RED}/>
  </Svg>
);
const IconUser = () => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#FFF"/>
  </Svg>
);
const IconBox = () => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#FFF"/>
  </Svg>
);
const IconBank = () => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Path d="M4 10h3v7H4zM10.5 10h3v7h-3zM2 19h20v3H2zM17 10h3v7h-3zM12 1L2 6v2h20V6z" fill="#FFF"/>
  </Svg>
);

export const InvoicePDF: React.FC<{ data: InvoiceData }> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBgCurve} />
        
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                {data.logoBase64 ? (
                  <Image src={data.logoBase64} style={styles.logoImage} />
                ) : (
                  <>
                    <Text style={styles.logoPlaceholder}>INFERNO</Text>
                    <Text style={styles.logoPlaceholder}>CREATIVE</Text>
                  </>
                )}
              </View>
              <View style={styles.companyInfo}>
                <Text style={styles.companyName1}>INFERNO</Text>
                <Text style={styles.companyName2}>CREATIVE</Text>
                <Text style={styles.companyTagline}>CAPTURE MOMENTS, CREATE STORIES</Text>
                <View style={styles.companyContactRow}>
                  <IconLocation />
                  <Text style={styles.companyContactText}>Br. Angkeb, Canging Gulingan{'\n'}Mengwi, Badung, Bali</Text>
                </View>
                <View style={styles.companyContactRow}>
                  <IconIG />
                  <Text style={styles.companyContactText}>@inferno.creativee</Text>
                </View>
                <View style={styles.companyContactRow}>
                  <IconWA />
                  <Text style={styles.companyContactText}>085645150857</Text>
                </View>
              </View>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.invoiceTitleBox}>
                <Text style={styles.invoiceTitle}>INVOICE</Text>
              </View>
              <View style={styles.invoiceMetaBox}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>No. Invoice</Text>
                  <Text style={styles.metaValue}>:  {data.invoice_number}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Tanggal Invoice</Text>
                  <Text style={styles.metaValue}>:  {data.invoice_date || '-'}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Batas Pembayaran</Text>
                  <Text style={styles.metaValue}>:  {data.payment_deadline || '-'}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Status Pembayaran</Text>
                  <Text style={styles.metaValue}>:  {data.payment_status || '-'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 2 COLUMNS */}
          <View style={styles.twoCol}>
            <View style={styles.infoBox}>
              <View style={styles.infoBoxTitleRow}>
                <View style={{ backgroundColor: PRIMARY_RED, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                  <IconUser />
                </View>
                <Text style={styles.infoBoxTitle}>DITERBITKAN UNTUK</Text>
              </View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama Customer</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoValue}>{data.nama || '-'}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Lokasi Kegiatan</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoValue}>{data.lokasi || '-'}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Tanggal Kegiatan</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoValue}>{data.tanggal || '-'}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Mulai Jam</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoValue}>{data.jam || '-'}</Text></View>
            </View>
            
            <View style={styles.infoBox}>
              <View style={styles.infoBoxTitleRow}>
                <View style={{ backgroundColor: PRIMARY_RED, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                  <IconBox />
                </View>
                <Text style={styles.infoBoxTitle}>DETAIL PAKET</Text>
              </View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Paket Photobooth</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoValue}>{data.paket || 'Paket Basic 4 Jam'}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Durasi</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoValue}>{data.duration || '-'}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Kapasitas Print</Text><Text style={styles.infoColon}>:</Text><Text style={styles.infoValue}>{data.print_capacity || '-'}</Text></View>
            </View>
          </View>

          {/* TABLE */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.thNo}>NO.</Text>
              <Text style={styles.thDesc}>DESKRIPSI</Text>
              <Text style={styles.thQty}>DURASI / QTY</Text>
              <Text style={styles.thPrice}>HARGA SATUAN</Text>
              <Text style={styles.thTotal}>TOTAL</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tdNo}>1.</Text>
              <Text style={styles.tdDesc}>{data.paket || 'Paket Basic 4 Jam'}</Text>
              <View style={styles.tdQtyBox}>
                <Text style={styles.tdQty}>{data.duration || '-'}</Text>
                <Text style={styles.tdQtySub}>{data.print_capacity || ''}</Text>
              </View>
              <Text style={styles.tdPrice}>{formatCurrency(data.harga)}</Text>
              <Text style={styles.tdTotal}>{formatCurrency(data.subtotal)}</Text>
            </View>
            {/* Empty Rows for spacing/design */}
            {[2].map((num) => (
              <View key={num} style={{ ...styles.tableRow, borderBottomWidth: 0 }}>
                <Text style={styles.tdNo}>{num}.</Text>
                <Text style={styles.tdDesc}></Text>
                <View style={styles.tdQtyBox}></View>
                <Text style={styles.tdPrice}></Text>
                <Text style={styles.tdTotal}></Text>
              </View>
            ))}
          </View>

          {/* BOTTOM SECTION */}
          <View style={styles.bottomSection}>
            <View style={styles.bottomLeft}>
              <View style={styles.paymentInfoBox}>
                <View style={styles.infoBoxTitleRow}>
                   <View style={{ backgroundColor: PRIMARY_RED, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                      <IconBank />
                    </View>
                  <Text style={styles.infoBoxTitle}>INFORMASI PEMBAYARAN</Text>
                </View>
                <View style={styles.infoRow}><Text style={styles.paymentLabel}>Batas Pembayaran</Text><Text style={styles.paymentColon}>:</Text><Text style={styles.paymentValue}>{data.payment_deadline || '-'}</Text></View>
                <View style={styles.infoRow}><Text style={styles.paymentLabel}>Bank</Text><Text style={styles.paymentColon}>:</Text><Text style={styles.paymentValue}>BCA</Text></View>
                <View style={styles.infoRow}><Text style={styles.paymentLabel}>No. Rekening</Text><Text style={styles.paymentColon}>:</Text><Text style={styles.paymentValue}>6690955278</Text></View>
                <View style={styles.infoRow}><Text style={styles.paymentLabel}>Atas Nama</Text><Text style={styles.paymentColon}>:</Text><Text style={styles.paymentValue}>I Made Wisnu Pradnya Yoga</Text></View>
              </View>

              <Text style={styles.footerText}>
                Pembayaran dilakukan paling lambat pada hari H acara sebelum layanan Inferno Creative mulai beroperasi.
              </Text>
              <Text style={styles.footerThanks}>
                Terima kasih atas kepercayaan Anda kepada Inferno Creative.
              </Text>
            </View>

            <View style={styles.bottomRight}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>SUBTOTAL</Text>
                  <Text style={styles.summaryColon}>:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.subtotal)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>DISKON</Text>
                  <Text style={styles.summaryColon}>:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.discount)}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRowTotal}>
                  <Text style={styles.summaryLabelTotal}>TOTAL</Text>
                  <Text style={styles.summaryColon}>:</Text>
                  <Text style={styles.summaryValueTotal}>{formatCurrency(data.total)}</Text>
                </View>
              </View>

              <View style={styles.bigTotalBox}>
                <Text style={styles.bigTotalLabel}>TOTAL PEMBAYARAN</Text>
                <Text style={styles.bigTotalValue}>{formatCurrency(data.total)}</Text>
              </View>

              <View style={styles.statusBox}>
                <Text style={styles.statusLabel}>STATUS PEMBAYARAN</Text>
                <View style={styles.statusValueBox}>
                  <Text style={styles.statusValue}>{data.payment_status || '-'}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.thankYouArea}>
            <Text style={styles.thankYouText}>Thank You!</Text>
            <Text style={styles.thankYouSub}>FOR CHOOSING INFERNO CREATIVE</Text>
          </View>

        </View>

        <View style={styles.bottomBgCurveBlack} />
        <View style={styles.bottomBgCurve} />
      </Page>
    </Document>
  );
};

export default InvoicePDF;
