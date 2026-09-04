// Auto-generated seed data for Squad "Tài chính" — parsed from the QL_TCKT sample workbook.
// Mục tiêu cấp 1 -> cấp 2 -> cấp 3 (goals, via parent) and Sáng kiến cấp 1 -> cấp 2 -> cấp 3 (initiatives, via parent),
// with each Sáng kiến cấp 3 optionally carrying outputProduct ("Sản phẩm đầu ra", varchar 255) and linked to its Goal cấp 3 via goalTempId.

export type SeedGoal = { tempId: string; level: 1 | 2 | 3; parent: string | null; title: string; description: string };
export type SeedInitiative = {
  tempId: string; level: 1 | 2 | 3; parent: string | null; goalTempId: string | null;
  title: string; description: string; outputProduct: string | null; startDate: string | null; endDate: string | null;
};

export const TAI_CHINH_GOALS: SeedGoal[] = [
  { tempId: "G1", level: 1, parent: null, title: `Xây dựng năng lực quản lý tài chính theo định hướng chiến lược`, description: `Mục tiêu chiến lược tổng của Squad Tài chính, phân rã thành các mục tiêu cấp 2 và cấp 3 bên dưới.` },
  { tempId: "G1.1", level: 2, parent: "G1", title: `1. Nâng cao năng lực phân rã định lượng chiến lược và quản lý khép kín ngân sách toàn diện`, description: "" },
  { tempId: "G1.1.1", level: 3, parent: "G1.1", title: `1.1 Xây dựng hệ thống phân rã định lượng mục tiêu chiến lược và lập ngân sách đa chiều`, description: `Mục tiêu cụ thể:
- Xây dựng quy tắc lập ngân sách đa chiều (làm rõ cách phân rã mục tiêu ngân sách theo chiều quản lý, cấp tổ chức và chiều thời gian)

Khung KPI:
- - Hoàn thành bộ chỉ tiêu, tiêu chuẩn phân rã mục tiêu ngân sách giữa các Khối và ĐVKD
  - Định nghĩa: Bộ chỉ tiêu/tiêu chuẩn phân rã mục tiêu ngân sách được cấp có thẩm quyền phê duyệt, quy định phạm vi, nguyên tắc và yêu cầu phân rã ngân sách giữa các Khối nghiệp vụ và ĐVKD.
- Phương pháp thống kê: Ghi nhận theo trạng thái hoàn thành (Hoàn thành/Chưa hoàn thành) tại thời điểm văn bản được ban hành; Tỷ lệ hoàn thành = Số hạng mục/tiêu chuẩn đã ban hành ÷ Tổng số hạng mục theo kế hoạch. Tần suất theo dõi: hằng tháng/quý.
- - Hoàn thành khung xác định quy tắc chuyển đổi mục tiêu tài chính thành mục tiêu ngân sách
  - Định nghĩa: Khung quy tắc chuyển đổi mục tiêu tài chính thành mục tiêu ngân sách, làm rõ nguyên tắc, logic và công thức chuyển đổi cho từng Khối nghiệp vụ, đơn vị.
- Phương pháp thống kê: Ghi nhận theo trạng thái hoàn thành khung/quy tắc được ban hành; Tỷ lệ hoàn thành = Số quy tắc chuyển đổi đã ban hành ÷ Tổng số quy tắc theo kế hoạch.
- - Hoàn thành bộ chỉ tiêu mục tiêu chiến lược của toàn hàng.
- Hoàn thành bộ chỉ tiêu, mục tiêu tài chính liên quan đến mục tiêu chiến lược của toàn hàng
  - Tiêu chuẩn xác định mục tiêu chiến lược toàn hàng: nâng cao thị phần, tăng trưởng khách hàng, cải thiện chất lượng tài sản, v.v
- Các chỉ tiêu tài chính: doanh thu, lợi nhuận, ROE, tỷ lệ chi phí trên thu nhập
- - Hoàn thành mô hình tài chính phản ánh theo định hướng chiến lược
  - Định nghĩa: Mô hình tài chính theo định hướng chiến lược (gồm quy tắc ánh xạ chiến lược - tài chính và các cấu phần dự báo) làm cơ sở đầu vào cho lập ngân sách hằng năm.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành mô hình (được phê duyệt và đưa vào sử dụng cho kỳ lập ngân sách); Tỷ lệ hoàn thành = Số cấu phần mô hình hoàn thành ÷ Tổng số cấu phần theo kế hoạch.` },
  { tempId: "G1.1.2", level: 3, parent: "G1.1", title: `1.2 Xây dựng cơ chế giám sát thực hiện ngân sách, dự báo cuốn chiếu và điều chỉnh động`, description: `Mục tiêu cụ thể:
- Xây dựng quy tắc giám sát và điều chỉnh động việc thực hiện ngân sách (hình thành vòng khép kín gồm thực hiện, phân tích, dự báo và điều chỉnh ngân sách)

Khung KPI:
- - Hoàn thành khung xác định quy tắc quản lý dữ liệu, giám sát về ngân sách
  - Định nghĩa: Khung quy tắc quản lý dữ liệu và giám sát ngân sách, gồm yêu cầu về tính nhất quán, khả năng so sánh của dữ liệu thực hiện ngân sách, tiêu chuẩn nhận diện bất thường và quy tắc cảnh báo.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành văn bản/quy tắc được ban hành; Tỷ lệ hoàn thành = Số quy tắc dữ liệu, quy tắc cảnh báo đã ban hành ÷ Tổng số quy tắc theo kế hoạch.` },
  { tempId: "G1.2", level: 2, parent: "G1", title: `2. Xây dựng hệ thống quản lý giám sát thực thi và đánh giá dựa trên chuyển đổi.`, description: "" },
  { tempId: "G1.2.1", level: 3, parent: "G1.2", title: `2.1 Xây dựng hệ thống chỉ tiêu giám sát thực thi và đánh giá.`, description: `Mục tiêu cụ thể:
- Xây dựng hệ thống chỉ tiêu đánh giá và giám sát chiến lược tiêu chuẩn hóa, thực hiện ánh xạ mục tiêu chiến lược sang các chỉ tiêu giám sát.
- Thiết lập cơ chế vận hành giám sát thường xuyên và ứng dụng kết quả, hỗ trợ điều chỉnh linh hoạt nguồn lực và tối ưu hóa quyết định kinh doanh.

Khung KPI:
- - Hoàn thành bộ chỉ tiêu xây dựng hệ thống về triển khai sản phẩm
  - Định nghĩa: Bộ chỉ tiêu đánh giá công tác xây dựng hệ thống về triển khai sản phẩm và tích lũy năng lực (số sản phẩm triển khai, tiến độ triển khai, mức độ hoàn thiện quy trình/hệ thống hỗ trợ sản phẩm).
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ chỉ tiêu được ban hành; Tỷ lệ hoàn thành = Số chỉ tiêu đã thiết kế, thống nhất ÷ Tổng số chỉ tiêu theo thiết kế khung.
- - Hoàn thành bộ chỉ tiêu mở rộng thị trường về độ bao phủ khách hàng và quy mô kinh doanh.
  - Định nghĩa: Bộ chỉ tiêu mở rộng thị trường, đo lường độ bao phủ khách hàng (số/tỷ lệ khách hàng, địa bàn, kênh được bao phủ) và quy mô kinh doanh (dư nợ, huy động, doanh thu).
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ chỉ tiêu; Tỷ lệ hoàn thành = Số chỉ tiêu đã thiết kế, thống nhất ÷ Tổng số chỉ tiêu theo thiết kế khung.
- - Hoàn thành khung xác định nguyên tắc thống kê, quản lý và giám sát.
- Hoàn thành bộ chỉ tiêu theo dõi, quản lý và giám sát
  - Định nghĩa: Khung nguyên tắc thống nhất về định nghĩa, quy tắc thống kê, chu kỳ xác nhận của các chỉ tiêu đánh giá chiến lược và bộ chỉ tiêu theo dõi, quản lý, giám sát tương ứng.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành văn bản khung nguyên tắc; Tỷ lệ hoàn thành = Số chỉ tiêu đã được chuẩn hóa định nghĩa/quy tắc thống kê ÷ Tổng số chỉ tiêu trong bộ chỉ tiêu giám sát.
- - Số nguồn dữ liệu được xác định
- Số nguồn dữ liệu được chuẩn hóa
- Tỷ lệ hoàn thành nguồn dữ liệu theo kế hoạch
  - Định nghĩa: Nguồn dữ liệu được xác định là nguồn đã làm rõ hệ thống nguồn, yếu tố dữ liệu và bộ phận chịu trách nhiệm thống kê; Nguồn dữ liệu được chuẩn hóa là nguồn đã áp dụng định nghĩa, quy tắc thống kê thống nhất.
- Phương pháp thống kê: Đếm số nguồn dữ liệu được xác định và số nguồn được chuẩn hóa (lũy kế); Tỷ lệ hoàn thành = Số nguồn dữ liệu chuẩn hóa ÷ Tổng số nguồn dữ liệu theo kế hoạch. Tần suất: hằng quý.
- - Hoàn thành cơ chế xác định tiêu chuẩn giám sát mục tiêu tài chính và mục tiêu kinh doanh.
  - Định nghĩa: Cơ chế/tiêu chuẩn giám sát mục tiêu tài chính và mục tiêu kinh doanh, gồm tiêu chuẩn ánh xạ chỉ tiêu, ngưỡng giám sát và trách nhiệm giám sát.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành cơ chế được ban hành; Tỷ lệ hoàn thành = Số cấu phần cơ chế (tiêu chuẩn ánh xạ, ngưỡng, phân công) hoàn thành ÷ Tổng số cấu phần theo kế hoạch.
- - Hoàn thành xây dựng bộ chỉ tiêu giám sát mục tiêu tài chính và mục tiêu kinh doanh
  - Định nghĩa: Bộ chỉ tiêu giám sát gắn kết mục tiêu tài chính (thu nhập, lợi nhuận, chi phí) với mục tiêu kinh doanh (quy mô, khách hàng, sản phẩm) kèm quan hệ chuyển đổi giữa hai nhóm.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ chỉ tiêu; Tỷ lệ hoàn thành = Số chỉ tiêu kinh doanh đã ánh xạ với chỉ tiêu tài chính ÷ Tổng số chỉ tiêu cần ánh xạ.
- - Hoàn thành xây dựng công cụ báo cáo giám sát và phân tích chuyên sâu hiệu quả chuyển đổi theo chu kỳ.
- Tỷ lệ hoàn thành báo cáo phân tích giám sát chuyên sâu theo chuyên đề đối với các lĩnh vực chiến lược và dự án trọng điểm
  - Định nghĩa: Công cụ/báo cáo giám sát và phân tích chuyên sâu hiệu quả chuyển đổi theo chu kỳ, bao quát tiến độ, chênh lệch và nguyên nhân; báo cáo chuyên đề áp dụng cho lĩnh vực chiến lược và dự án trọng điểm.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành công cụ báo cáo; Tỷ lệ hoàn thành báo cáo = Số báo cáo chuyên đề phát hành đúng hạn ÷ Tổng số báo cáo theo kế hoạch trong kỳ. Tần suất: theo chu kỳ báo cáo (tháng/quý).
- - Hoàn thành xây dựng bộ chỉ tiêu ngưỡng cảnh báo phân cấp và quy tắc kích hoạch đối với tiến độ đánh giá/ sai lệch hiệu quả.
- Công cụ quản lý theo dõi ngưỡng cảnh báo, giám sát thường xuyên
  - Định nghĩa: Bộ ngưỡng cảnh báo phân cấp (theo mức độ chậm tiến độ/sai lệch hiệu quả) và quy tắc kích hoạt cảnh báo tự động; công cụ theo dõi ngưỡng phục vụ giám sát thường xuyên.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ ngưỡng và công cụ; theo dõi số lượt cảnh báo được kích hoạt/kỳ và tỷ lệ cảnh báo được xử lý đúng hạn.` },
  { tempId: "G1.2.2", level: 3, parent: "G1.2", title: `2.2 Lồng ghép đánh giá chiến lược theo cấp vào hệ thống kinh doanh.`, description: `Mục tiêu cụ thể:
- Thực hiện truyền dẫn trách nhiệm đánh giá chiến lược đến tất cả các cấp, bảo đảm quyền hạn và trách nhiệm của từng chủ thể phù hợp, định hướng thống nhất.

Khung KPI:
- - Hoàn thành cơ chế báo cáo công tác và nguyên tắc xác định quy đổi trách nhiệm đối với mức độ hoàn thành mục tiêu chiến lược của cấp quản lý.
  - Định nghĩa: Cơ chế báo cáo công tác và nguyên tắc quy đổi trách nhiệm đối với mức độ hoàn thành mục tiêu chiến lược của cấp quản lý (chu kỳ báo cáo, nội dung, chủ thể chịu trách nhiệm, cách quy đổi).
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành cơ chế được ban hành; Tỷ lệ tuân thủ = Số đơn vị/cấp quản lý thực hiện báo cáo đúng chu kỳ ÷ Tổng số đơn vị thuộc phạm vi áp dụng.
- - Hoàn thành công cụ đánh giá chiến lược vào hệ thống đánh giá tổng hợp cấp quản lý của hội sở và các đơn vị chi nhánh.
  - Định nghĩa: Công cụ đưa kết quả đánh giá chiến lược vào hệ thống đánh giá tổng hợp cấp quản lý của Hội sở và đơn vị chi nhánh (bảng tính điểm, tỷ trọng, kết nối dữ liệu đánh giá).
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành và đưa công cụ vào áp dụng; Tỷ lệ áp dụng = Số đơn vị áp dụng công cụ ÷ Tổng số đơn vị thuộc phạm vi.
- - Hoàn thiện nguyên tắc xác định cơ chế báo cáo công tác và nguyên tắc xác định quy đổi trách nhiệm đối với mức độ hoàn thành mục tiêu chiến lược của cấp quản lý.
  - Định nghĩa: Nguyên tắc hoàn thiện cơ chế báo cáo công tác và quy đổi trách nhiệm theo mức độ hoàn thành mục tiêu chiến lược của cấp quản lý (bổ sung, cập nhật so với cơ chế ban đầu).
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành văn bản hoàn thiện/cập nhật; Tỷ lệ hoàn thành = Số nội dung hoàn thiện ÷ Tổng số nội dung theo kế hoạch.
- - Hoàn thiện nguyên tắc xác định tỷ trọng các chỉ tiêu đánh giá chuyển đổi tại các khu vực trọng điểm chiến lược.
  - Định nghĩa: Nguyên tắc xác định tỷ trọng (quyền số) của các chỉ tiêu đánh giá chuyển đổi áp dụng cho các khu vực trọng điểm chiến lược.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành nguyên tắc; theo dõi tỷ trọng chỉ tiêu chuyển đổi thực tế áp dụng tại khu vực trọng điểm (%) so với mức quy định.
- - Hoàn thiện nguyên tắc xác định mục tiêu đánh giá chiến lược và hỗ trợ nguồn lực riêng phù hợp với các khu vực trọng điểm.
  - Định nghĩa: Nguyên tắc xác định mục tiêu đánh giá chiến lược riêng và cơ chế hỗ trợ nguồn lực (nhân sự, ngân sách, hạn mức) phù hợp với các khu vực trọng điểm.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành nguyên tắc; Tỷ lệ áp dụng = Số khu vực trọng điểm được thiết lập mục tiêu và nguồn lực riêng ÷ Tổng số khu vực trọng điểm được xác định.
- - Hoàn thiện Khung quy định theo dõi các dự án chiến lược ngắn hạn áp dụng đánh giá độc lập theo chế độ dự án, không chiếm dụng cơ sở thông thường.
  - Định nghĩa: Khung quy định theo dõi các dự án chiến lược ngắn hạn theo chế độ dự án, đánh giá độc lập, không chiếm dụng chỉ tiêu/cơ sở đánh giá thông thường.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành khung quy định; Tỷ lệ áp dụng = Số dự án chiến lược ngắn hạn được theo dõi theo khung ÷ Tổng số dự án thuộc phạm vi.
- - Hoàn thiện Khung quy định quản lý toàn quy trình đánh giá theo chế độ dự án, từ phê duyệt, theo dõi đến kết thúc dự án.
  - Định nghĩa: Khung quy định quản lý toàn quy trình đánh giá theo chế độ dự án, từ phê duyệt, theo dõi thực hiện đến kết thúc và đánh giá sau dự án.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành khung quy định; Tỷ lệ tuân thủ = Số dự án thực hiện đầy đủ các bước theo khung ÷ Tổng số dự án trong kỳ.` },
  { tempId: "G1.3", level: 2, parent: "G1", title: `3. Nâng cao năng lực phân tích chuyên sâu dữ liệu tài chính.`, description: "" },
  { tempId: "G1.3.1", level: 3, parent: "G1.3", title: `3.1 Nâng cao năng lực xử lý tự động dữ liệu tài chính (tối ưu hóa quy trình thu thập, xử lý và hỗ trợ phân tích dữ liệu tài chính, giảm khối lượng xử lý dữ liệu thủ công).`, description: `Mục tiêu cụ thể:
- Nâng cao năng lực tự động thu thập dữ liệu tài chính liên hệ thống (nâng cao mức độ tự động thu thập dữ liệu tài chính cốt lõi, giảm khối lượng lấy dữ liệu thủ công và tích hợp dữ liệu liên hệ thống).
- Nâng cao năng lực tự động xử lý dữ liệu tài chính (nâng cao mức độ tự động gia công dữ liệu tài chính, giảm khối lượng xử lý dữ liệu thủ công).
- Nâng cao năng lực tự động xuất kết quả phân tích kinh doanh (nâng cao hiệu quả xuất kết quả phân tích kinh doanh, tăng cường năng lực hỗ trợ phân tích tài chính).

Khung KPI:
- - Hoàn thành xây dựng Bộ chỉ tiêu tiêu chuẩn và luồng quy trình thu thập dữ liệu.
  - Định nghĩa: Bộ chỉ tiêu tiêu chuẩn và luồng quy trình thu thập dữ liệu tài chính liên hệ thống (yêu cầu thu thập, truyền tải, tích hợp và phân công trách nhiệm).
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành quy trình được ban hành; Mức độ tự động = Số trường/luồng dữ liệu thu thập tự động ÷ Tổng số trường/luồng dữ liệu tài chính cốt lõi.
- - Hoàn thành xây dựng Bộ chỉ tiêu tiêu chuẩn thu thập dữ liệu tài chính liên hệ thống: xác định nguồn, yếu tố dữ liệu, đường dẫn thu thập, tiêu chuẩn giao diện và tiêu chuẩn truyền dữ liệu tài chính
  - Định nghĩa: Bộ tiêu chuẩn thu thập dữ liệu tài chính liên hệ thống, xác định nguồn dữ liệu (FTP, sổ cái tổng hợp, core nghiệp vụ), yếu tố dữ liệu, đường dẫn thu thập, tiêu chuẩn giao diện và truyền dữ liệu.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ tiêu chuẩn; Tỷ lệ hoàn thành = Số hệ thống nguồn đã chuẩn hóa giao diện thu thập ÷ Tổng số hệ thống nguồn theo kế hoạch.
- - Hoàn thành xây dựng Bộ chỉ tiêu tiêu chuẩn xử lý dữ liệu tài chính, thống nhất quy tắc xử lý, quy chuẩn dữ liệu và tiêu chuẩn đầu ra tại từng khâu, đảm bảo tính nhất quán của dữ liệu
  - Định nghĩa: Bộ tiêu chuẩn xử lý dữ liệu tài chính, thống nhất quy tắc xử lý, quy chuẩn dữ liệu và tiêu chuẩn đầu ra tại các khâu làm sạch, chuyển đổi, tổng hợp, tính toán và xuất dữ liệu.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ tiêu chuẩn; Tỷ lệ hoàn thành = Số khâu xử lý đã ban hành tiêu chuẩn ÷ Tổng số khâu xử lý theo kế hoạch.
- -  Hoàn thành xây dựng quy trình xử lý dữ liệu tài chính, quy chuẩn hóa logic xử lý, trình tự thực hiện.
- Xây dựng công cụ kết nối quy trình xử lý dữ liệu tiêu chuẩn hóa.
  - Định nghĩa: Quy trình xử lý dữ liệu tài chính được quy chuẩn hóa về logic xử lý, trình tự thực hiện, yêu cầu kết nối giữa các khâu; kèm công cụ kết nối quy trình xử lý tiêu chuẩn hóa.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành quy trình và công cụ; Tỷ lệ tự động hóa = Số bước xử lý được thực hiện qua công cụ ÷ Tổng số bước trong quy trình.
- - Hoàn thành bộ tiêu chuẩn kiểm soát chất lượng dữ liệu tài chính, xác định yêu cầu chất lượng về tính đầy đủ, chính xác và nhất quán của dữ liệu.
- Xây dựng công cụ nhận diện, kiểm tra và xử lý tình huống bất thường
  - Định nghĩa: Bộ tiêu chuẩn kiểm soát chất lượng dữ liệu tài chính (tính đầy đủ, chính xác, nhất quán) và công cụ nhận diện, kiểm tra, xử lý tình huống bất thường.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ tiêu chuẩn và công cụ; Tỷ lệ đáp ứng = Số chốt kiểm tra chất lượng đạt yêu cầu ÷ Tổng số chốt kiểm tra được thiết lập trong kỳ.
- - Hoàn thành xây dựng quy tắc xử lý dữ liệu tài chính tự động, xác định logic xử lý, điều kiện thực hiện và quy tắc vận hành của các trường hợp làm sạch, chuyển đổi, tính toán và tổng hợp tự động.
- Xây dựng công cụ xác định logic xử lý, và vận hành các trường hợp làm sạch dữ liệu.
- Xây dựng các cộng tự động về xử lý dữ liệu tài chính
  - Định nghĩa: Quy tắc xử lý dữ liệu tài chính tự động, xác định logic xử lý, điều kiện thực hiện và quy tắc vận hành cho các trường hợp làm sạch, chuyển đổi, tính toán, tổng hợp tự động; kèm công cụ tự động tương ứng.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành quy tắc và công cụ; Mức độ tự động hóa = Số trường hợp xử lý tự động ÷ Tổng số trường hợp xử lý dữ liệu tài chính.
- - Hoàn thành Bộ tiêu chuẩn phân loại dữ liệu về khách hàng, sản phẩm, ngành, đơn vị và các kênh.
- Xây dựng công cụ theo dõi các dữ liệu và phân loại dữ liệu giữa hệ thống kinh doanh và hệ thống tài chính
  - Định nghĩa: Bộ tiêu chuẩn phân loại dữ liệu chủ về khách hàng, sản phẩm, ngành, đơn vị, kênh; kèm công cụ theo dõi và ánh xạ phân loại dữ liệu giữa hệ thống kinh doanh và hệ thống tài chính.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ tiêu chuẩn và công cụ; Tỷ lệ nhất quán = Số đối tượng dữ liệu có ánh xạ phân loại thống nhất giữa hai hệ thống ÷ Tổng số đối tượng thuộc phạm vi.
- - Hoàn thành Bộ tiêu chuẩn xác định logic, điều kiện để xây dựng hệ thống tự động
'- Xây dựng công cụ tự động tạo báo cáo phân tích kinh doanh, các điều kiện và logic dữ liệu
  - Định nghĩa: Bộ tiêu chuẩn xác định logic, điều kiện tạo báo cáo phân tích kinh doanh tự động (điều kiện kích hoạt, logic gọi dữ liệu, logic tạo nội dung, yêu cầu đầu ra) và công cụ tạo báo cáo tự động.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ tiêu chuẩn và công cụ; Tỷ lệ tự động = Số báo cáo phân tích được tạo tự động ÷ Tổng số báo cáo phân tích định kỳ.
- - Hoàn thành Bộ tiêu chuẩn về mẫu báo cáo, quy chuẩn biểu đồ và trực quan hóa kết quả kinh doanh
  - Định nghĩa: Bộ tiêu chuẩn trình bày kết quả phân tích kinh doanh: các chiều phân tích, mẫu báo cáo, quy chuẩn biểu đồ và tiêu chuẩn trực quan hóa.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ tiêu chuẩn; Tỷ lệ áp dụng = Số báo cáo tuân thủ mẫu/quy chuẩn ÷ Tổng số báo cáo phát hành trong kỳ.
- - Hoàn thành Bộ tiêu chuẩn về ứng dụng kết quả phân tích kinh doanh, quy định về chia sẻ, ứng dụng và quản lý kết quả kinh doanh
  - Định nghĩa: Bộ quy chuẩn ứng dụng kết quả phân tích kinh doanh, quy định yêu cầu về phát hành, chia sẻ, ứng dụng và quản lý kết quả phân tích.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành quy chuẩn; Tỷ lệ ứng dụng = Số kết quả phân tích được sử dụng cho quyết định kinh doanh/điều chỉnh nguồn lực ÷ Tổng số kết quả phân tích phát hành.` },
  { tempId: "G1.3.2", level: 3, parent: "G1.3", title: `3.2 Nâng cao năng lực ứng dụng quản lý kinh doanh dữ liệu tích hợp kinh doanh - tài chính (thúc đẩy ứng dụng chuyên sâu dữ liệu tích hợp kinh doanh - tài chính trong quản lý kinh doanh, nâng cao năng lực hỗ trợ quản lý kinh doanh).`, description: `Mục tiêu cụ thể:
- Xây dựng năng lực phân tích lợi nhuận và quản lý giá trị

Khung KPI:
- - Hoàn thành Bộ tiêu chuẩn phân loại dữ liệu về khách hàng, sản phẩm, ngành, đơn vị và các kênh.
- Xây dựng công cụ theo dõi các dữ liệu và phân loại dữ liệu giữa hệ thống kinh doanh và hệ thống tài chính
  - Định nghĩa: Bộ tiêu chuẩn phân loại dữ liệu chủ (khách hàng, sản phẩm, ngành, đơn vị, kênh) phục vụ phân tích lợi nhuận và quản lý giá trị; kèm công cụ ánh xạ dữ liệu giữa hệ thống kinh doanh và tài chính.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành bộ tiêu chuẩn và công cụ; Tỷ lệ nhất quán = Số đối tượng dữ liệu (phân ngành, phân tầng khách hàng, phân loại sản phẩm) được ánh xạ thống nhất ÷ Tổng số đối tượng thuộc phạm vi.
- - Công cụ hạch toán phân bổ chi phí toàn phần
- Cộng cụ tự động tập hợp chi phí trực tiếp và phân bổ chi phí gián tiếp theo động lực.
- Công cụ lập báo cáo chi phí toàn phần theo từng chiều định kỳ
  - Định nghĩa: Công cụ hạch toán phân bổ chi phí toàn phần: tự động tập hợp chi phí trực tiếp, tự động phân bổ chi phí gián tiếp theo động lực (cost driver) và tự động lập báo cáo chi phí toàn phần theo từng chiều.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành công cụ và đưa vào vận hành; Tỷ lệ chi phí được phân bổ tự động = Chi phí phân bổ tự động ÷ Tổng chi phí phân bổ; Số báo cáo chi phí toàn phần phát hành/kỳ.
- - Công cụ theo dõi bảng điều khiển kinh doanh cấp tuyến, phân tích các chiều của sản phẩm, khách hàng và CBQL khách hàng
- Công cụ rà soát kinh doanh hàng ngày, tối ưu hóa cơ cấu khách hàng
  - Định nghĩa: Công cụ bảng điều khiển (dashboard) kinh doanh cấp tuyến, phân tích xuyên suốt theo chiều sản phẩm, nhóm khách hàng và cán bộ quản lý khách hàng, hỗ trợ rà soát kinh doanh hằng ngày và tối ưu cơ cấu khách hàng.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành công cụ; Tỷ lệ đơn vị/chi nhánh sử dụng dashboard; Tần suất cập nhật dữ liệu (hằng ngày).
- - Công cụ theo dõi lợi nhuận dự án chuyên biệt cho các trọng điểm chuyển đổi
  - Định nghĩa: Công cụ theo dõi lợi nhuận dự án chuyên biệt cho các trọng điểm chuyển đổi, giám sát tiến độ đầu tư và đầu ra theo chu kỳ.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành công cụ; Số dự án trọng điểm được theo dõi lợi nhuận; Tỷ lệ dự án có báo cáo lợi nhuận đúng chu kỳ.
- - Công cụ tự động tính toán RAROC/EVA, tự động đo lường kết quả tạo giá trị của từng giao dịch, từng khách hàng, từng ngành và từng dự án, đồng bộ dữ liệu với hệ thống nghiệp vụ
  - Định nghĩa: Công cụ tự động tính toán RAROC/EVA, đo lường kết quả tạo giá trị theo từng giao dịch, khách hàng, ngành và dự án, đồng bộ dữ liệu với hệ thống nghiệp vụ.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành công cụ; Tỷ lệ đối tượng (giao dịch/khách hàng/ngành/dự án) được tính RAROC-EVA tự động ÷ Tổng số đối tượng thuộc phạm vi; Tần suất tính toán.
- - Hoàn thành Cơ chế xếp hạng ưu tiên các lĩnh vực dựa trên RAROC, đánh giá hàng quý năng lực tạo giá trị của các ngành chiến lược
  - Định nghĩa: Cơ chế xếp hạng ưu tiên các lĩnh vực/ngành, sản phẩm trọng điểm dựa trên RAROC, đánh giá định kỳ hằng quý và điều chỉnh thứ tự ưu tiên phân bổ nguồn lực.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành cơ chế; Số kỳ đánh giá xếp hạng thực hiện/năm (mục tiêu 4 kỳ); Số lĩnh vực được xếp hạng và số lần điều chỉnh ưu tiên nguồn lực.
- - Hoàn thành Cơ chế trích lập thưởng hiệu suất dựa trên EVA
  - Định nghĩa: Cơ chế trích lập thưởng hiệu suất dựa trên EVA, gắn kết quả tạo giá trị với cơ chế khuyến khích cho đội nhóm/cá nhân.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành cơ chế được phê duyệt; Tỷ lệ quỹ thưởng được xác định theo EVA ÷ Tổng quỹ thưởng hiệu suất; Số đơn vị áp dụng.
- - Hoàn thành Cơ chế cảnh báo sớm linh hoạt về lợi nhuận và rủi ro
  - Định nghĩa: Cơ chế cảnh báo sớm linh hoạt về lợi nhuận và rủi ro, kích hoạt biện pháp điều chỉnh (siết hạn mức, tăng định giá, điều chỉnh tiêu chuẩn tiếp nhận) với lĩnh vực có RAROC giảm liên tục hoặc tỷ lệ nợ xấu vượt chuẩn.
- Phương pháp thống kê: Ghi nhận trạng thái hoàn thành cơ chế; Số lượt cảnh báo kích hoạt/kỳ; Tỷ lệ cảnh báo được xử lý bằng biện pháp điều chỉnh đúng hạn.` },
  { tempId: "G1.4", level: 2, parent: "G1", title: `4. Nâng cao năng lực quản trị dữ liệu toàn ngân hàng`, description: "" },
  { tempId: "G1.4.1", level: 3, parent: "G1.4", title: `4.1 Thiết lập hệ thống tiêu chuẩn dữ liệu thống nhất`, description: `Mục tiêu cụ thể:
- Thống nhất tiêu chuẩn dữ liệu cốt lõi trên toàn ngân hàng, hình thành định nghĩa dữ liệu, quy tắc mã hóa và quy chuẩn nghiệp vụ thống nhất
- Thực hiện quản lý thống nhất các tiêu chuẩn dữ liệu, đảm bảo tiêu chuẩn được cập nhật liên tục và thực thi hiệu quả

Khung KPI:
- -  Tỷ lệ hoàn thành văn bản theo kế hoạch.
- Tỷ lệ dữ liệu cốt lõi được chuẩn hóa
- Tỷ lệ hệ thống áp dụng tiêu chuẩn dữ liệu thống nhất
  - tỷ lệ hoàn thành văn bản theo kế hoạch = số văn bản (Định nghĩa dữ liệu; quy tắc mã hóa; quy chuẩn nghiệp vụ) đã ban hành / tổng số văn bản theo kế hoạch trong kỳ.
- tỷ lệ dữ liệu cốt lõi được chuẩn hóa = số đối tượng/thuộc tính dữ liệu cốt lõi (khách hàng; sản phẩm; tài khoản; tổ chức; giao dịch) đã áp dụng tiêu chuẩn thống nhất / tổng số đối tượng/thuộc tính dữ liệu cốt lõi được xác định.
- tỷ lệ hệ thống áp dụng tiêu chuẩn dữ liệu thống nhất = số hệ thống đã áp dụng tiêu chuẩn / tổng số hệ thống thuộc phạm vi.
- Tần suất thống kê: hằng quý; lũy kế đến thời điểm báo cáo.
- - Tỷ lệ hoàn thành văn bản theo kế hoạch
- Tỷ lệ tiêu chuẩn dữ liệu được rà soát định kỳ 
- Thời gian cập nhật tiêu chuẩn sau khi có thay đổi nghiệp vụ.
- Tỷ lệ đơn vị tuân thủ tiêu chuẩn dữ liệu
- Công cụ quản lý vận hành tiêu chuẩn dữ liệu
  - tỷ lệ hoàn thành văn bản theo kế hoạch = số văn bản/quy trình về quản lý tiêu chuẩn dữ liệu đã ban hành / tổng số theo kế hoạch.
- tỷ lệ tiêu chuẩn dữ liệu được rà soát Định kỳ = số tiêu chuẩn được rà soát trong kỳ / tổng số tiêu chuẩn đã ban hành.
- thời gian cập nhật tiêu chuẩn sau khi có thay đổi nghiệp vụ = số ngày làm việc bình quân từ thời điểm phát sinh thay đổi nghiệp vụ đến khi tiêu chuẩn được cập nhật; ban hành.
- tỷ lệ đơn vị tuân thủ tiêu chuẩn dữ liệu = số đơn vị đạt yêu cầu qua kiểm tra thực thi / tổng số đơn vị được kiểm tra.
- công cụ quản lý vận hành tiêu chuẩn dữ liệu: Ghi nhận theo trạng thái hoàn thành và đưa vào sử dụng.
- Tần suất thống kê: hằng quý.` },
  { tempId: "G1.4.2", level: 3, parent: "G1.4", title: `4.2 Nâng cao năng lực quản lý chất lượng dữ liệu`, description: `Mục tiêu cụ thể:
- Đảm bảo chất lượng dữ liệu nghiệp vụ cốt lõi đạt mức ổn định và có thể kiểm soát, hỗ trợ vận hành nghiệp vụ và ra quyết định kinh doanh
- Thực hiện giám sát toàn bộ quá trình và cải thiện khép kín các vấn đề về chất lượng dữ liệu

Khung KPI:
- - Tỷ lệ đáp ứng các nguyên tắc kiểm tra chất lượng dữ liệu của các dữ liệu trọng yếu 
- Tỷ lệ hoàn thành văn bản quy định về tiêu chuẩn chất lượng dữ liệu theo kế hoạch
- Tỷ lệ lỗi dữ liệu trọng yếu giảm theo từng năm
  - Tỷ lệ đáp ứng nguyên tắc kiểm tra chất lượng dữ liệu của dữ liệu trọng yếu = Số chốt kiểm tra (Data Quality Rule) đạt yêu cầu ÷ Tổng số chốt kiểm tra được thiết lập cho dữ liệu trọng yếu trong kỳ.
- Tỷ lệ hoàn thành văn bản quy định về tiêu chuẩn chất lượng dữ liệu = Số văn bản đã ban hành ÷ Tổng số văn bản theo kế hoạch.
- Tỷ lệ lỗi dữ liệu trọng yếu = Số bản ghi/trường lỗi ÷ Tổng số bản ghi/trường được kiểm tra; so sánh với cùng kỳ năm trước để đánh giá mức giảm theo năm.
- Tần suất thống kê: hằng tháng, tổng hợp hằng quý/năm.
- - Tỷ lệ Data Quality Rule được tự động giám sát
- Tỷ lệ lỗi dữ liệu được phát hiện chủ động.
- Tỷ lệ xử lý Data Quality Issue đúng SLA.
- Tỷ lệ hoàn thành văn bản theo kế hoạch
- Công cụ quản lý vận hành tiêu chuẩn dữ liệu
  - Tỷ lệ Data Quality Rule được tự động giám sát = Số rule được giám sát tự động ÷ Tổng số rule đã thiết lập.
- Tỷ lệ lỗi dữ liệu được phát hiện chủ động = Số lỗi do hệ thống giám sát/cảnh báo phát hiện ÷ Tổng số lỗi phát hiện trong kỳ (bao gồm lỗi do đơn vị nghiệp vụ phản ánh).
- Tỷ lệ xử lý Data Quality Issue đúng SLA = Số vấn đề được khắc phục, đóng trong thời hạn SLA ÷ Tổng số vấn đề phát sinh trong kỳ.
- Tỷ lệ hoàn thành văn bản theo kế hoạch = Số văn bản đã ban hành ÷ Tổng số theo kế hoạch.
- Công cụ quản lý vận hành tiêu chuẩn dữ liệu: ghi nhận theo trạng thái hoàn thành và đưa vào sử dụng.
- Tần suất thống kê: hằng tháng/quý.` },
  { tempId: "G1.4.3", level: 3, parent: "G1.4", title: `4.3 Thiết lập hệ thống quản lý tài sản dữ liệu cấp toàn hàng`, description: `Mục tiêu cụ thể:
- Thực hiện nhận diện thống nhất, quản lý thống nhất và vận hành theo chuẩn đối với tài sản dữ liệu toàn ngân hàng
- Thực hiện liên tục khai thác giá trị tài sản dữ liệu, hỗ trợ đổi mới nghiệp vụ và quản lý vận hành

Khung KPI:
- - Tỷ lệ tài sản dữ liệu được đăng ký và xác định được mối quan hệ sở hữu, quản lý.
- Tỷ lệ tài sản dữ liệu có Metadata đầy đủ.
- Tỷ lệ hoàn thành văn bản theo kế hoạch
  0x1d
- - Số Use Case khai thác dữ liệu được triển khai
- Số sáng kiến kinh doanh dựa trên dữ liệu
- Tỷ lệ hoàn thành văn bản theo kế hoạch
- Tỷ lệ lỗi được khắc phục liên quan đến vận hành tài sản dữ liệu
  - Số Use Case khai thác dữ liệu được triển khai: đếm số tình huống ứng dụng dữ liệu đã đưa vào vận hành thực tế trong kỳ (lũy kế).
- Số sáng kiến kinh doanh dựa trên dữ liệu: đếm số sáng kiến được đề xuất và phê duyệt có cơ sở phân tích dữ liệu.
- Tỷ lệ hoàn thành văn bản theo kế hoạch = Số văn bản (quy tắc chia sẻ, duy trì, đánh giá, vòng đời tài sản dữ liệu) đã ban hành ÷ Tổng số theo kế hoạch.
- Tỷ lệ lỗi được khắc phục liên quan đến vận hành tài sản dữ liệu = Số lỗi đã khắc phục, đóng ÷ Tổng số lỗi phát sinh trong kỳ.
- Tần suất thống kê: hằng quý.` },
  { tempId: "G1.4.4", level: 3, parent: "G1.4", title: `4.4 Nâng cao năng lực chia sẻ và cung cấp dịch vụ dữ liệu`, description: `Mục tiêu cụ thể:
- Thực hiện chia sẻ dữ liệu hiệu quả giữa các bộ phận, nâng cao hiệu suất sử dụng dữ liệu
- Thực hiện năng lực cung cấp dịch vụ dữ liệu thống nhất, nâng cao hiệu quả tiếp nhận dữ liệu của nghiệp vụ

Khung KPI:
- - Tỷ lệ yêu cầu chia sẻ dữ liệu được đáp ứng
- Thời gian xử lý các yêu cầu chia sẻ dữ liệu
- Mức độ hài lòng của đơn vị sử dụng
  - Tỷ lệ yêu cầu chia sẻ dữ liệu được đáp ứng = Số yêu cầu được cấp quyền/cung cấp dữ liệu ÷ Tổng số yêu cầu hợp lệ tiếp nhận trong kỳ.
- Thời gian xử lý yêu cầu chia sẻ dữ liệu = Số ngày làm việc bình quân từ khi tiếp nhận yêu cầu đến khi hoàn tất cung cấp.
- Mức độ hài lòng của đơn vị sử dụng: điểm bình quân theo khảo sát định kỳ (thang điểm quy định), khảo sát tối thiểu 01 lần/năm.
- Tần suất thống kê: hằng quý.
- - Tỷ lệ SLA cung cấp dữ liệu được đáp ứng
- Tỷ lệ dữ liệu được cung cấp qua nền tảng tập trung
- Thời gian cung cấp dữ liệu cho đơn vị nghiệp vụ
  - Tỷ lệ SLA cung cấp dữ liệu được đáp ứng = Số lượt cung cấp dữ liệu/dịch vụ dữ liệu đúng cam kết SLA ÷ Tổng số lượt cung cấp trong kỳ.
- Tỷ lệ dữ liệu được cung cấp qua nền tảng tập trung = Số lượt (hoặc khối lượng) dữ liệu cung cấp qua nền tảng/dịch vụ dữ liệu tập trung ÷ Tổng số lượt cung cấp (bao gồm cung cấp thủ công).
- Thời gian cung cấp dữ liệu cho đơn vị nghiệp vụ = Số ngày (giờ) làm việc bình quân từ khi tiếp nhận yêu cầu đến khi dữ liệu sẵn sàng sử dụng.
- Tần suất thống kê: hằng tháng/quý.` },
  { tempId: "G1.4.5", level: 3, parent: "G1.4", title: `4.5 Thiết lập hệ thống vận hành quản trị dữ liệu`, description: `Mục tiêu cụ thể:
- Thiết lập tổ chức và mô hình quản lý quản trị dữ liệu với trách nhiệm rõ ràng và phối hợp hiệu quả
- Thực hiện vận hành liên tục và nâng cao năng lực quản trị dữ liệu

Khung KPI:
- - Cơ cấu Qurn trị dữ liệu
- Tỷ lệ quyết định quản trị dữ liệu được thực thi
- Tỷ lệ Data Domain có Data Owner
- Tỷ lệ Domain có Data Steward
  - Cơ cấu quản trị dữ liệu: ghi nhận theo trạng thái hoàn thành việc thiết lập cơ cấu tổ chức, phân công trách nhiệm (Hội đồng/đầu mối quản trị dữ liệu, Data Owner, Data Steward) được cấp có thẩm quyền phê duyệt.
- Tỷ lệ quyết định quản trị dữ liệu được thực thi = Số quyết định/kết luận đã triển khai hoàn thành ÷ Tổng số quyết định ban hành trong kỳ.
- Tỷ lệ Data Domain có Data Owner = Số domain đã chỉ định Data Owner ÷ Tổng số Data Domain được xác định.
- Tỷ lệ Domain có Data Steward = Số domain đã chỉ định Data Steward ÷ Tổng số Data Domain được xác định.
- Tần suất thống kê: hằng quý.
- - Điểm trưởng thành quản trị dữ liệu.
- Tỷ lệ các vấn đề liên quan đến quản trị dữ liệu được khắc phục.
  - Điểm trưởng thành quản trị dữ liệu: điểm đánh giá theo bộ tiêu chuẩn/khung đánh giá mức độ trưởng thành do Ngân hàng ban hành, thực hiện đánh giá định kỳ (tối thiểu 01 lần/năm), so sánh với kỳ trước và mục tiêu.
- Tỷ lệ vấn đề liên quan đến quản trị dữ liệu được khắc phục = Số vấn đề đã khắc phục và xác minh hiệu quả ÷ Tổng số vấn đề được ghi nhận trong kỳ.
- Tần suất thống kê: hằng quý (điểm trưởng thành: hằng năm).` },
  { tempId: "G1.4.6", level: 3, parent: "G1.4", title: `4.6 Xây dựng văn hóa dữ liệu trên toàn hệ thống`, description: `Mục tiêu cụ thể:
- Xây dựng văn hóa dữ liệu phù hợp với SHB nhằm thúc đẩy việc coi dữ liệu là tài sản của tổ chức.

Khung KPI:
- - Số lượng khóa đào tạo liên quan đến dữ liệu.
- Tỷ lệ cán bộ hoàn thành đào tạo dữ liệu
- Mức độ nhận thức dữ liệu (khảo sát định kỳ)
Số sáng kiến sử dụng dữ liệu do đơn vị nghiệp vụ đề xuất
  - Số lượng khóa đào tạo liên quan đến dữ liệu: đếm số khóa/chương trình đào tạo về dữ liệu được tổ chức trong kỳ.
- Tỷ lệ cán bộ hoàn thành đào tạo dữ liệu = Số cán bộ hoàn thành khóa đào tạo (đạt yêu cầu kiểm tra) ÷ Tổng số cán bộ thuộc đối tượng đào tạo.
- Mức độ nhận thức dữ liệu: điểm bình quân theo khảo sát định kỳ về nhận thức dữ liệu (thang điểm quy định), thực hiện tối thiểu 01 lần/năm.
- Số sáng kiến sử dụng dữ liệu do đơn vị nghiệp vụ đề xuất: đếm số sáng kiến được đề xuất và ghi nhận trong kỳ.
- Tần suất thống kê: hằng quý.` },
  { tempId: "G1.5", level: 2, parent: "G1", title: `5. Chính sách FTP, định giá sản phẩm là công cụ truyền dẫn chiến lược kinh doanh giúp phát triển khách hàng/sản phẩm từng thời kỳ`, description: "" },
  { tempId: "G1.5.1", level: 3, parent: "G1.5", title: `5.1 Duy trì Cơ chế định giá riêng, linh hoạt cho khách hàng, sản phẩm chiến lược bên cạnh cơ chế định giá chung.`, description: `Mục tiêu cụ thể:
- Cơ chế FTP cho các sản phẩm/khách hàng chiến lược đáp ứng mục tiêu SHB từng thời kỳ` },
  { tempId: "G1.5.2", level: 3, parent: "G1.5", title: `5.2 Xây dựng cơ chế định giá sản phẩm đáp ứng nhu cầu hoạt động kinh doanh và phù hợp với thông lệ thị trường, hướng tới chuẩn mức quốc tế`, description: `Mục tiêu cụ thể:
- Cơ chế định giá các sản phẩm/khách hàng sử dụng vốn minh bạch, dễ xác định giá và so sánh được hiệu quả giữa các sản phẩm, khách hàng` },
  { tempId: "G1.6", level: 2, parent: "G1", title: `6. Nâng cao năng lực quản trị hiệu quả đầu tư và mua sắm`, description: "" },
  { tempId: "G1.6.1", level: 3, parent: "G1.6", title: `6.1 Tối ưu hiệu quả đầu tư và mua sắm`, description: `` },
  { tempId: "G1.6.2", level: 3, parent: "G1.6", title: `6.2 Đánh giá hiệu quả đầu tư, quản trị danh mục dự án, tối ưu hóa nhà cung cấp và hợp đồng`, description: `` },
  { tempId: "G1.6.3", level: 3, parent: "G1.6", title: `6.3 Kiểm soát ngân sách và minh bạch`, description: `` },
];

export const TAI_CHINH_INITIATIVES: SeedInitiative[] = [
  { tempId: "I1", level: 1, parent: null, goalTempId: null, title: `Xây dựng quy tắc phân rã định lượng mục tiêu chiến lược theo từng cấp`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I1.1", level: 2, parent: "I1", goalTempId: "G1.1.1", title: `Xây dựng quy tắc chuyển đổi mục tiêu tài chính thành mục tiêu ngân sách (làm rõ cách phân rã mục tiêu tài chính thành mục tiêu ngân sách của từng khối nghiệp vụ và đơn vị)`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I1.2", level: 2, parent: "I1", goalTempId: "G1.1.1", title: `Xây dựng mối quan hệ ánh xạ giữa mục tiêu chiến lược và mục tiêu tài chính`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I2", level: 1, parent: null, goalTempId: null, title: `Xây dựng hệ thống lập ngân sách đa chiều (hình thành hệ thống lập ngân sách kết hợp chiều quản lý, cấp tổ chức và chiều thời gian)`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I2.1", level: 2, parent: "I2", goalTempId: "G1.1.1", title: `Xây dựng quy tắc phân rã ngân sách theo chiều quản lý (làm rõ cách phân rã mục tiêu ngân sách theo khối nghiệp vụ, sản phẩm, phân khúc khách hàng, v.v.)`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I2.2", level: 2, parent: "I2", goalTempId: "G1.1.1", title: `Xây dựng quy tắc kết nối ngân sách theo cấp tổ chức và chiều thời gian (làm rõ cách kết nối từ hội sở chính đến chi nhánh, từ năm đến quý và tháng)`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I3", level: 1, parent: null, goalTempId: null, title: `Chuẩn hóa hệ thống giám sát thực hiện ngân sách đa chiều`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I3.1", level: 2, parent: "I3", goalTempId: "G1.1.2", title: `Xây dựng quy tắc giám sát thực hiện ngân sách`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I3.2", level: 2, parent: "I3", goalTempId: "G1.1.2", title: `Xây dựng quy tắc thu thập dữ liệu thực hiện ngân sách (làm rõ cách thu thập và quản lý dữ liệu thực hiện ngân sách)`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I4", level: 1, parent: null, goalTempId: null, title: `Hoàn thiện khung và Quản trị chỉ tiêu chiến lược`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I4.1", level: 2, parent: "I4", goalTempId: "G1.2.1", title: `Phân rã mục tiêu chiến lược và thiết kế các chỉ tiêu đánh giá.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I4.2", level: 2, parent: "I4", goalTempId: "G1.2.1", title: `Quản lý tiêu chuẩn hóa các quy tắc chỉ tiêu.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I5", level: 1, parent: null, goalTempId: null, title: `Thiết lập cơ chế phân tích và cảnh báo giám sát thường xuyên.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I5.1", level: 2, parent: "I5", goalTempId: "G1.2.1", title: `Thiết lập cơ chế liên kết giữa mục tiêu tài chính và mục tiêu kinh doanh.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I5.2", level: 2, parent: "I5", goalTempId: "G1.2.1", title: `Cơ chế báo cáo giám sát định kỳ và cảnh báo sai lệch bất thường`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I6", level: 1, parent: null, goalTempId: null, title: `Xây dựng cơ chế đánh giá đối với các tuyến kinh doanh và cấp quản lý.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I6.1", level: 2, parent: "I6", goalTempId: "G1.2.2", title: `Lồng ghép đánh giá cốt lõi của các tuyến kinh doanh. Gắn kết đánh giá cấp quản lý`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I6.2", level: 2, parent: "I6", goalTempId: "G1.2.2", title: `Gắn kết đánh giá cấp quản lý.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I7", level: 1, parent: null, goalTempId: null, title: `Thiết lập cơ chế đánh giá khác biệt theo khu vực.
Cơ chế liên kết đánh giá và phân bổ nguồn lực`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I7.1", level: 2, parent: "I7", goalTempId: "G1.2.2", title: `Tăng cường đánh giá tại các khu vực chiến lược trọng điểm.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I8", level: 1, parent: null, goalTempId: null, title: `Triển khai mô hình đánh giá chuyên đề chiến lược.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I8.1", level: 2, parent: "I8", goalTempId: "G1.2.2", title: `Đánh giá độc lập theo chế độ dự án.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I9", level: 1, parent: null, goalTempId: null, title: `Hoàn thiện cơ chế thu thập dữ liệu tài chính (thông qua thống nhất tiêu chuẩn thu thập dữ liệu liên hệ thống và quy tắc quản lý dữ liệu cốt lõi, thực hiện tự động thu thập dữ liệu tài chính, giảm khối lượng lấy dữ liệu thủ công và tích hợp dữ liệu liên hệ thống).`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I9.1", level: 2, parent: "I9", goalTempId: "G1.3.1", title: `Hoàn thiện quy tắc thu thập dữ liệu tài chính liên hệ thống (xác định nguồn dữ liệu, đường dẫn thu thập và phân công trách nhiệm của từng hệ thống, thống nhất quy chuẩn thu thập, tiêu chuẩn giao diện và yêu cầu truyền dữ liệu).`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I10", level: 1, parent: null, goalTempId: null, title: `Hoàn thiện cơ chế xử lý dữ liệu tài chính (thông qua xây dựng quy trình xử lý dữ liệu tiêu chuẩn hóa và quy tắc xử lý tự động, thực hiện tự động gia công dữ liệu tài chính, nâng cao hiệu quả và chất lượng xử lý dữ liệu).`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I10.1", level: 2, parent: "I10", goalTempId: "G1.3.1", title: `Hoàn thiện quy tắc xử lý dữ liệu tài chính tiêu chuẩn hóa (quy chuẩn hóa toàn bộ quy trình làm sạch, chuyển đổi, tổng hợp và tính toán dữ liệu, hình thành tiêu chuẩn gia công thống nhất, giảm can thiệp thủ công).`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I10.2", level: 2, parent: "I10", goalTempId: "G1.3.1", title: `Hoàn thiện quy tắc xử lý dữ liệu tài chính tự động (thiết lập quy tắc kiểm tra tự động, tính toán tự động và xử lý bất thường, nâng cao tính ổn định và độ chính xác của xử lý dữ liệu).`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I11", level: 1, parent: null, goalTempId: null, title: `Hoàn thiện cơ chế xuất kết quả phân tích kinh doanh (thông qua quy chuẩn hóa tiêu chuẩn tạo lập và trình bày kết quả, thực hiện tự động tạo báo cáo phân tích kinh doanh, rút ngắn chu kỳ lập báo cáo).`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I11.1", level: 2, parent: "I11", goalTempId: "G1.3.1", title: `Hoàn thiện quy chuẩn tạo lập kết quả phân tích kinh doanh (thống nhất mẫu báo cáo, quy chuẩn chỉ tiêu và quy tắc tạo lập, thực hiện tự động tạo báo cáo phân tích kinh doanh).`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I11.2", level: 2, parent: "I11", goalTempId: "G1.3.1", title: `Hoàn thiện quy chuẩn trình bày kết quả phân tích kinh doanh (thống nhất các chiều phân tích, mẫu trình bày và phương thức trực quan hóa, nâng cao hiệu quả chia sẻ và ứng dụng quản lý kết quả).`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I12", level: 1, parent: null, goalTempId: null, title: `Nâng cao năng lực tập hợp lợi nhuận đa chiều và quản lsy giá trị`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I12.1", level: 2, parent: "I12", goalTempId: "G1.3.2", title: `Thống nhất dữ liệu chủ và quy chuẩn chỉ tiêu lợi nhuận kinh doanh - tài chính.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I12.2", level: 2, parent: "I12", goalTempId: "G1.3.2", title: `Xuất bảng điều khiển dữ liệu lợi nhuận đa chiều theo từng cấp.`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I13", level: 1, parent: null, goalTempId: null, title: `Năng lực ứng dụng toàn quy trình lợi nhuận sau điều chỉnh rủi ro (RAROC/EVA)`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I13.1", level: 2, parent: "I13", goalTempId: "G1.3.2", title: `Xây dựng mô hình đo lường RAROC/EVA và quy tắc phân bổ vốn`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I13.2", level: 2, parent: "I13", goalTempId: "G1.3.2", title: `Ứng dụng trong phân bổ nguồn lực chiến lược`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I13.3", level: 2, parent: "I13", goalTempId: "G1.3.2", title: `Ứng dụng trong kiểm soát vốn rủi ro`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I14", level: 1, parent: null, goalTempId: null, title: `Thiết lập năng lực quản lý tiêu chuẩn dữ liệu cốt lõi`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I14.1", level: 2, parent: "I14", goalTempId: "G1.4.1", title: `Thiết lập tiêu chuẩn dữ liệu cốt lõi`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I14.2", level: 2, parent: "I14", goalTempId: "G1.4.1", title: `Thiết lập tiêu chuẩn dữ liệu dùng chung`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I15", level: 1, parent: null, goalTempId: null, title: `Thiết lập năng lực quản lý vận hành tiêu chuẩn dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I15.1", level: 2, parent: "I15", goalTempId: "G1.4.1", title: `Thiết lập quy trình quản lý tiêu chuẩn dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I15.2", level: 2, parent: "I15", goalTempId: "G1.4.1", title: `Thiết lập cơ chế giám sát thực thi tiêu chuẩn dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I15.3", level: 2, parent: "I15", goalTempId: "G1.4.1", title: `Thiết lập các công cụ quản lý thông tin và tiêu chuẩn dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I16", level: 1, parent: null, goalTempId: null, title: `Thiết lập năng lực quản lý chất lượng dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I16.1", level: 2, parent: "I16", goalTempId: "G1.4.2", title: `Thiết lập tiêu chuẩn chất lượng dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I16.2", level: 2, parent: "I16", goalTempId: "G1.4.2", title: `Thiết lập quy tắc kiểm tra chất lượng dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I17", level: 1, parent: null, goalTempId: null, title: `Thiết lập năng lực vận hành chất lượng dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I17.1", level: 2, parent: "I17", goalTempId: "G1.4.2", title: `Thiết lập cơ chế giám sát chất lượng dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I17.2", level: 2, parent: "I17", goalTempId: "G1.4.2", title: `Thiết lập cơ chế khép kín xử lý vấn đề chất lượng dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I17.3", level: 2, parent: "I17", goalTempId: "G1.4.2", title: `Thiết lập năng lực công nghệ và số hóa vận hành quản lý chất lượng dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I18", level: 1, parent: null, goalTempId: null, title: `Thiết lập năng lực quản lý tài sản dữ liệu cấp doanh nghiệp`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I18.1", level: 2, parent: "I18", goalTempId: "G1.4.3", title: `Thiết lập hệ thống danh mục tài sản dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I18.2", level: 2, parent: "I18", goalTempId: "G1.4.3", title: `Thiết lập hệ thống phân loại và phân cấp tài sản dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I19", level: 1, parent: null, goalTempId: null, title: `Nâng cao năng lực vận hành tài sản dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I19.1", level: 2, parent: "I19", goalTempId: "G1.4.3", title: `Thiết lập cơ chế vận hành tài sản dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I19.2", level: 2, parent: "I19", goalTempId: "G1.4.3", title: `Thúc đẩy ứng dụng tài sản dữ liệu trong nghiệp vụ`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I20", level: 1, parent: null, goalTempId: null, title: `Thiết lập năng lực chia sẻ dữ liệu thống nhất`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I20.1", level: 2, parent: "I20", goalTempId: "G1.4.4", title: `Thiết lập cơ chế quản lý chia sẻ dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I20.2", level: 2, parent: "I20", goalTempId: "G1.4.4", title: `Thiết lập năng lực cung cấp dịch vụ chia sẻ dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I21", level: 1, parent: null, goalTempId: null, title: `Thiết lập nền tảng chia sẻ dữ liệu thu thập thủ công tập trung`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I21.1", level: 2, parent: "I21", goalTempId: "G1.4.4", title: `Thiết lập nguyên tắc và cơ chế tập trung hóa dữ liệu với các dữ liệu thu thập thủ công`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I21.2", level: 2, parent: "I21", goalTempId: "G1.4.4", title: `Thiết lập năng lực quản lý dữ liệu thu thập thủ công`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I22", level: 1, parent: null, goalTempId: null, title: `Thiết lập năng lực dịch vụ dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I22.1", level: 2, parent: "I22", goalTempId: "G1.4.4", title: `Thiết lập danh mục dịch vụ dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I22.2", level: 2, parent: "I22", goalTempId: "G1.4.4", title: `Thiết lập cơ chế vận hành dịch vụ dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I23", level: 1, parent: null, goalTempId: null, title: `Thiết lập năng lực tổ chức và thể chế quản trị dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I23.1", level: 2, parent: "I23", goalTempId: "G1.4.5", title: `Thiết lập hệ thống tổ chức quản trị dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I23.2", level: 2, parent: "I23", goalTempId: "G1.4.5", title: `Thiết lập hệ thống thể chế quản trị dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I24", level: 1, parent: null, goalTempId: null, title: `Thiết lập năng lực vận hành quản trị dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I24.1", level: 2, parent: "I24", goalTempId: "G1.4.5", title: `Thiết lập cơ chế đánh giá quản trị dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I24.2", level: 2, parent: "I24", goalTempId: "G1.4.5", title: `Thiết lập cơ chế liên tục tối ưu hóa quản trị`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I25", level: 1, parent: null, goalTempId: null, title: `Xây dựng văn hóa dữ liệu trên toàn hệ thống`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I25.1", level: 2, parent: "I25", goalTempId: "G1.4.6", title: `Thiết lập năng lực quản lý thay đổi nhằm phát triển văn hóa dữ liệu`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I25.2", level: 2, parent: "I25", goalTempId: "G1.4.6", title: `Nâng cao năng lực Data Literacy, thúc đẩy nhận thức về QTDL`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I26", level: 1, parent: null, goalTempId: null, title: `Rà soát và xác định định giá FTP theo sát chiến lược khách hàng của Khối Kinh doanh (theo khối nghiệp vụ, phân khúc khách hàng, sản phẩm, kỳ hạn, mục tiêu chiến lược,…)`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I26.1", level: 2, parent: "I26", goalTempId: "G1.5.1", title: `Rà soát và xác định định giá FTP theo sát chiến lược khách hàng của Khối NHBL`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I26.2", level: 2, parent: "I26", goalTempId: "G1.5.1", title: `Rà soát và xác định định giá FTP theo sát chiến lược khách hàng của Khối NHDN`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I27", level: 1, parent: null, goalTempId: null, title: `Xây dựng cơ chế định giá tài sản có dựa trên rủi ro`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I27.1", level: 2, parent: "I27", goalTempId: "G1.5.2", title: `Xây dựng phương pháp luận định giá dựa trên rủi ro`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I27.2", level: 2, parent: "I27", goalTempId: "G1.5.2", title: `Phối hợp với  các đơn vị có liên quan Xây dựng các ngưỡng và công thức xác định các cấu phần tiêu chuẩn để định giá dựa trên rủi ro`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I27.3", level: 2, parent: "I27", goalTempId: "G1.5.2", title: `Xây dựng hệ thống tính giá tài sản có dựa trên rủi ro`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I28", level: 1, parent: null, goalTempId: null, title: `Chuẩn hóa quy trình và tiêu chuẩn định giá`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I28.1", level: 2, parent: "I28", goalTempId: "G1.6.1", title: `Xây dựng hệ thống tính giá tài sản có dựa trên rủi ro`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I29", level: 1, parent: null, goalTempId: null, title: `Xây dựng cơ sở dữ liệu dự án, đầu tư`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I29.1", level: 2, parent: "I29", goalTempId: "G1.6.2", title: `Xây dựng hệ thống tính giá tài sản có dựa trên rủi ro`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I30", level: 1, parent: null, goalTempId: null, title: `Quản trị vòng đời dự án và hiệu quả sử dụng`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I30.1", level: 2, parent: "I30", goalTempId: "G1.6.3", title: `Xây dựng hệ thống tính giá tài sản có dựa trên rủi ro`, description: "", outputProduct: null, startDate: null, endDate: null },
  { tempId: "I1.1.1", level: 3, parent: "I1.1", goalTempId: "G1.1.1", title: `Xây dựng tiêu chuẩn phân rã mục tiêu ngân sách, làm rõ phạm vi và yêu cầu phân rã mục tiêu ngân sách giữa các khối nghiệp vụ và cấp đơn vị khác nhau.`, description: `Đơn vị chủ trì: Khối QL TCKT — Đảm bảo tiêu chuẩn phân rã rõ ràng, bám sát chiến lược, phù hợp thực tế
Đơn vị phối hợp: Khối KD, Khối hỗ trợ tại trụ sở chính — Cung cấp thông tin, cho ý kiến đóng góp nhằm xác định mức độ phù hợp của tiêu chuẩn phân rã
Sáng kiến tiền đề: Xây dựng quy tắc phân rã định lượng mục tiêu chiến lược theo từng cấp
Quick Win: Có
Milestone: Có`, outputProduct: `Bộ tiêu chuẩn/nguyên tắc định lượng phân rã mục tiêu ngân sách`, startDate: `Tháng 10/2026`, endDate: `Tháng 3/2027` },
  { tempId: "I1.1.2", level: 3, parent: "I1.1", goalTempId: "G1.1.1", title: `Xây dựng quy tắc chuyển đổi mục tiêu tài chính thành mục tiêu ngân sách, làm rõ nguyên tắc và logic chuyển đổi mục tiêu tài chính thành mục tiêu ngân sách của các khối nghiệp vụ, đơn vị, v.v.`, description: `Đơn vị chủ trì: Khối QL TCKT — Đảm bảo tiêu chuẩn phân rã rõ ràng, bám sát chiến lược, phù hợp thực tế
Đơn vị phối hợp: Khối KD, Khối hỗ trợ tại trụ sở chính — Cung cấp thông tin, cho ý kiến đóng góp nhằm xác định mức độ phù hợp của tiêu chuẩn phân rã`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I1.2.1", level: 3, parent: "I1.2", goalTempId: "G1.1.1", title: `Rà soát danh mục mục tiêu chiến lược của toàn ngân hàng (như nâng cao thị phần, tăng trưởng khách hàng, cải thiện chất lượng tài sản), đồng thời xác định mục tiêu tài chính tương ứng với từng mục tiêu chiến lược (doanh thu, lợi nhuận, ROE, tỷ lệ chi phí trên thu nhập, v.v.)`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I1.2.2", level: 3, parent: "I1.2", goalTempId: "G1.1.1", title: `Xây dựng mô hình tài chính và quy tắc ánh xạ theo định hướng chiến lược, hình thành cơ sở đầu vào cho lập ngân sách hằng năm`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I2.1.1", level: 3, parent: "I2.1", goalTempId: "G1.1.1", title: `Xây dựng tiêu chuẩn chiều quản lý ngân sách, làm rõ các chiều quản lý ngân sách như khối nghiệp vụ, đơn vị, sản phẩm, phân khúc khách hàng, phạm vi áp dụng và chuẩn mực quản lý.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I2.1.2", level: 3, parent: "I2.1", goalTempId: "G1.1.1", title: `Xây dựng tiêu chuẩn phân rã mục tiêu ngân sách đa chiều, làm rõ logic phân rã, phương pháp phân bổ, nguyên tắc phân bổ và yêu cầu phân rã mục tiêu của các chiều quản lý khác nhau.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I2.2.1", level: 3, parent: "I2.2", goalTempId: "G1.1.1", title: `Xây dựng quy tắc kết nối ngân sách từ hội sở chính đến chi nhánh, làm rõ phạm vi lập ngân sách và logic tổng hợp ở từng cấp.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I2.2.2", level: 3, parent: "I2.2", goalTempId: "G1.1.1", title: `Xây dựng quy tắc phân rã ngân sách từ năm đến quý và tháng, làm rõ logic tổng hợp ngân sách ở từng cấp và yêu cầu kết nối ngân sách giữa cấp trên và cấp dưới.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I3.1.1", level: 3, parent: "I3.1", goalTempId: "G1.1.2", title: `Xây dựng quy tắc quản lý dữ liệu thực hiện ngân sách, làm rõ yêu cầu quản lý tính nhất quán và khả năng so sánh của dữ liệu thực hiện ngân sách.
làm rõ tiêu chuẩn nhận diện bất thường và quy tắc xác định cảnh báo.`, description: `Đơn vị chủ trì: Khối QL TCKT — Làm rõ tiêu chuẩn nhận diện và cảnh báo
Đơn vị phối hợp: Khối CNTT, Các đơn vị trong khối TC và các khối kinh doanh — Làm rõ nhu cầu, mong muốn trong công tác quản trị ngân sách tại đơn vị
Sáng kiến tiền đề: Chuẩn hóa hệ thống giám sát thực hiện ngân sách đa chiều
Quick Win: Có`, outputProduct: `Tiêu chuẩn dữ liệu và quy tắc nhận diện bất thường/cảnh báo`, startDate: `Tháng 11/2026`, endDate: `Tháng 3/2027` },
  { tempId: "I3.1.2", level: 3, parent: "I3.1", goalTempId: "G1.1.2", title: `Xây dựng hệ thống chỉ tiêu giám sát thực hiện ngân sách, làm rõ các chiều giám sát và chỉ tiêu giám sát thực hiện ngân sách.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I3.2.1", level: 3, parent: "I3.2", goalTempId: "G1.1.2", title: `Xây dựng tiêu chuẩn thu thập dữ liệu thực hiện ngân sách, làm rõ nguồn dữ liệu, tần suất thu thập và chuẩn mực tập hợp dữ liệu.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I3.2.2", level: 3, parent: "I3.2", goalTempId: "G1.1.2", title: `Xây dựng quy tắc quản lý dữ liệu thực hiện ngân sách, làm rõ yêu cầu quản lý tính nhất quán và khả năng so sánh của dữ liệu thực hiện ngân sách.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I4.1.1", level: 3, parent: "I4.1", goalTempId: "G1.2.1", title: `Thiết kế các chỉ tiêu xây dựng hệ thống về triển khai sản phẩm và tích lũy năng lực.`, description: `Đơn vị chủ trì: Khối QL TCKT — Định hướng khung chỉ tiêu tiêu chuẩn
Đơn vị phối hợp: Khối KD — Cung cấp mô tả, nhu cầu theo dõi quản trị và đặc tính các loại sản phẩm
Sáng kiến tiền đề: Hoàn thiện khung và Quản trị chỉ tiêu chiến lược`, outputProduct: `Khung chỉ tiêu xây dựng hệ thống về triển khai sản phẩm và tích lũy năng lực`, startDate: `Tháng 01/2027`, endDate: `Tháng 12/2027` },
  { tempId: "I4.1.2", level: 3, parent: "I4.1", goalTempId: "G1.2.1", title: `Thiết kế các chỉ tiêu mở rộng thị trường về độ bao phủ khách hàng và quy mô kinh doanh.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I4.2.1", level: 3, parent: "I4.2", goalTempId: "G1.2.1", title: `Thống nhất định nghĩa, quy tắc thống kê và chu kỳ xác nhận của tất cả các chỉ tiêu đánh giá chiến lược.`, description: `Đơn vị chủ trì: Khối QL TCKT — Chủ trì xây dựng quy tắc và hướng dẫn các đơn vị tham gia thực thi
Đơn vị phối hợp: Khối KD, Khối chuyển đổi — Phối hợp thống nhất chỉ tiêu
Sáng kiến tiền đề: Hoàn thiện khung và Quản trị chỉ tiêu chiến lược`, outputProduct: `Quy định định cơ chế kiểm soát tất cả các chỉ tiêu đánh giá chiến lược`, startDate: `Tháng 01/2027`, endDate: `Tháng 12/2027` },
  { tempId: "I4.2.2", level: 3, parent: "I4.2", goalTempId: "G1.2.1", title: `Xác định nguồn dữ liệu và bộ phận chịu trách nhiệm thống kê của từng chỉ tiêu.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I5.1.1", level: 3, parent: "I5.1", goalTempId: "G1.2.1", title: `Xây dựng tiêu chuẩn ánh xạ chỉ tiêu giữa mục tiêu tài chính và mục tiêu kinh doanh`, description: `Đơn vị chủ trì: Khối QL TCKT — Quản lý mô hình liên kết, phối hợp các đơn vị có liên quan tinh chỉnh/cập nhật phù hợp hoạt động mục tiêu kinh doanh
Đơn vị phối hợp: Khối KD, Khối chuyển đổi — Phối hợp cung cấp thông tin, mục tiêu chiến lược và tham gia xây dựng
Sáng kiến tiền đề: Thiết lập cơ chế phân tích và cảnh báo giám sát thường xuyên.
Quick Win: Có
Milestone: Có`, outputProduct: `Mô hình liên kết giữa mục tiêu tài chính và mục tiêu kinh doanh`, startDate: `Tháng 01/2027`, endDate: `Tháng 12/2027` },
  { tempId: "I5.1.2", level: 3, parent: "I5.1", goalTempId: "G1.2.1", title: `Xác định các chỉ tiêu kinh doanh như quy mô kinh doanh, khách hàng và sản phẩm tương ứng với các mục tiêu tài chính như thu nhập, lợi nhuận và chi phí, cùng mối quan hệ chuyển đổi.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I5.2.1", level: 3, parent: "I5.2", goalTempId: "G1.2.1", title: `Định kỳ lập báo cáo giám sát hiệu quả chuyển đổi theo chu kỳ cố định, bao quát tiến độ, chênh lệch và nguyên nhân. 
Thực hiện phân tích chuyên sâu theo chuyên đề đối với các lĩnh vực chiến lược cốt lõi dự án trọng điểm`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I5.2.2", level: 3, parent: "I5.2", goalTempId: "G1.2.1", title: `Thiết lập ngưỡng cảnh báo phân cấp và quy tắc kích hoạt đối với tiến độ đánh giá và sai lệch hiệu quả.
Tự động kích hoạt cảnh báo và đồng thời đưa ra cảnh báo rủi ro đối với các đơn vị chậm tiến độ hoặc không đạt hiệu quả.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I6.1.1", level: 3, parent: "I6.1", goalTempId: "G1.2.2", title: `Xác định trách nhiệm chủ thể và tỷ trọng quyền số đánh giá đối với việc triển khai chiến lược của từng tuyến.`, description: `Đơn vị chủ trì: Khối QL TCKT — Cung cấp công cụ, quy định hỗ trợ các đơn vị xác định rõ trách nhiệm và tỷ trọng quyền số phù hợp
Đơn vị phối hợp: Khối KD, Khối chuyển đổi — Phối hợp phân rã, cung cấp thông tin phục vụ quá trình xây dựng
Sáng kiến tiền đề: Xây dựng cơ chế đánh giá đối với các tuyến kinh doanh và cấp quản lý.`, outputProduct: `Quy định vai trò, trách nhiệm, cơ chế đánh giá với việc triển khai chiến lược từng tuyến`, startDate: `Tháng 01/2027`, endDate: `Tháng 12/2028` },
  { tempId: "I6.1.2", level: 3, parent: "I6.1", goalTempId: "G1.2.2", title: `Thiết lập cơ chế báo cáo công tác và quy trách nhiệm đối với mức độ hoàn thành mục tiêu chiến lược của cấp quản lý.`, description: `Đơn vị chủ trì: Khối QL TCKT — Xây dựng quy định và hướng dẫn, đánh giá thực thi
Đơn vị phối hợp: Khối KD, Khối chuyển đổi — Phối hợp phân rã, cung cấp thông tin phục vụ quá trình xây dựng
Sáng kiến tiền đề: Xây dựng cơ chế đánh giá đối với các tuyến kinh doanh và cấp quản lý.`, outputProduct: `Quy định vai trò, trách nhiệm, cơ chế đánh giá với việc triển khai chiến lược từng tuyến`, startDate: `Tháng 01/2027`, endDate: `Tháng 12/2028` },
  { tempId: "I6.2.1", level: 3, parent: "I6.2", goalTempId: "G1.2.2", title: `Đưa kết quả đánh giá chiến lược vào hệ thống đánh giá tổng hợp cấp quản lý của hội sở và các đơn vị chi nhánh.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I6.2.2", level: 3, parent: "I6.2", goalTempId: "G1.2.2", title: `Thiết lập cơ chế báo cáo công tác và quy trách nhiệm đối với mức độ hoàn thành mục tiêu chiến lược của cấp quản lý.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I7.1.1", level: 3, parent: "I7.1", goalTempId: "G1.2.2", title: `Tăng tỷ trọng các chỉ tiêu đánh giá chuyển đổi tại các khu vực trọng điểm chiến lược.`, description: `Đơn vị chủ trì: Khối QL TCKT — Xây dựng quy định và hướng dẫn, đánh giá thực thi
Đơn vị phối hợp: Khối KD, Khối chuyển đổi — Phối hợp rà soasrt/đánh giá, cung cấp thông tin phục vụ quá trình xây dựng
Sáng kiến tiền đề: Thiết lập cơ chế đánh giá khác biệt theo khu vực.
Cơ chế liên kết đánh giá và phân bổ nguồn lực`, outputProduct: `Thiết lập cơ chế/quy trình điều chỉnh tỷ trọng chi tiêu đánh giá phù hợp theo khu vực`, startDate: `Tháng 01/2027`, endDate: `Tháng 12/2028` },
  { tempId: "I7.1.2", level: 3, parent: "I7.1", goalTempId: "G1.2.2", title: `Thiết lập mục tiêu đánh giá chiến lược và hỗ trợ nguồn lực riêng phù hợp với các khu vực trọng điểm.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I8.1.1", level: 3, parent: "I8.1", goalTempId: "G1.2.2", title: `Các dự án chiến lược ngắn hạn áp dụng đánh giá độc lập theo chế độ dự án, không chiếm dụng cơ sở thông thường.`, description: `Đơn vị chủ trì: Khối QL TCKT — Hướng dẫn và chủ trì triển khai mô hình đánh giá chuyên đề chiến lược
Đơn vị phối hợp: Khối KD, Khối chuyển đổi — Phối hợp rà soasrt/đánh giá, cung cấp thông tin phục vụ quá trình xây dựng
Sáng kiến tiền đề: Triển khai mô hình đánh giá chuyên đề chiến lược.`, outputProduct: `Mô hình phân loại luồng đánh giá và tiêu chí đánh giá chuyên đề chiến lược`, startDate: `Tháng 6/2027`, endDate: `Tháng 12/2028` },
  { tempId: "I8.1.2", level: 3, parent: "I8.1", goalTempId: "G1.2.2", title: `Thiết lập quản lý toàn quy trình đánh giá theo chế độ dự án, từ phê duyệt, theo dõi đến kết thúc dự án.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I9.1.1", level: 3, parent: "I9.1", goalTempId: "G1.3.1", title: `Thiết lập quy trình thu thập dữ liệu tài chính liên hệ thống, xác định yêu cầu về thu thập, truyền tải, tích hợp dữ liệu tài chính liên hệ thống và phân công trách nhiệm, thống nhất quy chuẩn và tiêu chuẩn hóa quy trình thu thập dữ liệu.`, description: `Đơn vị chủ trì: Khối QL TCKT — Xây dựng tiêu chuẩn và luồng quy trình thu thập dữ liệu; mã hóa, dữ liệu tQài chính lõi và xử lý các vấn đề không nhất quán dữ liệu liên hệ thống
Đơn vị phối hợp: Khối CNTT, Khối KD — Phối hợp hỗ trợ hệ thống công nghệ, cung cấp thông tin hiện trạng và nhu cầu quản trị tại đơn vị
Sáng kiến tiền đề: Hoàn thiện cơ chế thu thập dữ liệu tài chính (thông qua thống nhất tiêu chuẩn thu thập dữ liệu liên hệ thống và quy tắc quản lý dữ liệu cốt lõi, thực hiện tự động thu thập dữ liệu tài chính, giảm khối lượng lấy dữ liệu thủ công và tích hợp dữ liệu liên hệ thống).`, outputProduct: `Quy trình và quy chuẩn thu thập dữ liệu tài chính liên hệ thống`, startDate: `Tháng 6/2027`, endDate: `Tháng 12/2028` },
  { tempId: "I9.1.2", level: 3, parent: "I9.1", goalTempId: "G1.3.1", title: `Thiết lập tiêu chuẩn thu thập dữ liệu tài chính liên hệ thống, xác định nguồn, yếu tố dữ liệu, đường dẫn thu thập, tiêu chuẩn giao diện và tiêu chuẩn truyền dữ liệu tài chính như FTP, sổ cái tổng hợp và hệ thống nghiệp vụ cốt lõi.`, description: `Đơn vị chủ trì: Khối QL TCKT`, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I10.1.1", level: 3, parent: "I10.1", goalTempId: "G1.3.1", title: `Thiết lập tiêu chuẩn xử lý dữ liệu tài chính, thống nhất quy tắc xử lý, quy chuẩn dữ liệu và tiêu chuẩn đầu ra tại các khâu làm sạch, chuyển đổi, tổng hợp, tính toán và xuất dữ liệu.`, description: `Đơn vị chủ trì: Khối QL TCKT — Phối hợp với các đơn vị có liên quan (Khối CNTT, Khối kinh doanh…)làm sạch, chuyển đổi, tổng hợp, xuất dữ liệu, tính toán
Đơn vị phối hợp: Khối CNTT, Khối KD — Đánh giá, rà soát thông tin dữ liệu tài chính đang được theo dõi, vướng mắc, chênh lệch và nguyên nhân, giải pháp khắc phục
Sáng kiến tiền đề: Hoàn thiện cơ chế thu thập dữ liệu tài chính (thông qua thống nhất tiêu chuẩn thu thập dữ liệu liên hệ thống và quy tắc quản lý dữ liệu cốt lõi, thực hiện tự động thu thập dữ liệu tài chính, giảm khối lượng lấy dữ liệu thủ công và tích hợp dữ liệu liên hệ thống).
Milestone: Có`, outputProduct: `Dữ liệu đã được làm sạch và chuẩn hóa`, startDate: `Tháng 6/2027`, endDate: `Tháng 12/2028` },
  { tempId: "I10.1.2", level: 3, parent: "I10.1", goalTempId: "G1.3.1", title: `Thiết lập quy trình xử lý dữ liệu tài chính, quy chuẩn hóa logic xử lý, trình tự thực hiện và yêu cầu kết nối quy trình tại các khâu gia công dữ liệu, hình thành quy trình xử lý dữ liệu tiêu chuẩn hóa.`, description: `Đơn vị chủ trì: Khối QL TCKT — Phối hợp với các đơn vị có liên quan (Khối CNTT, Khối kinh doanh…)làm sạch, chuyển đổi, tổng hợp, xuất dữ liệu, tính toán
Đơn vị phối hợp: Khối CNTT, Khối KD — Phối hợp xây dựng quy trình và thống nhất cách thức thực hiện
Sáng kiến tiền đề: Hoàn thiện cơ chế thu thập dữ liệu tài chính (thông qua thống nhất tiêu chuẩn thu thập dữ liệu liên hệ thống và quy tắc quản lý dữ liệu cốt lõi, thực hiện tự động thu thập dữ liệu tài chính, giảm khối lượng lấy dữ liệu thủ công và tích hợp dữ liệu liên hệ thống).`, outputProduct: `Dữ liệu đã được làm sạch và chuẩn hóa`, startDate: `Tháng 6/2027`, endDate: `Tháng 12/2028` },
  { tempId: "I10.2.1", level: 3, parent: "I10.2", goalTempId: "G1.3.1", title: `Thiết lập tiêu chuẩn kiểm soát chất lượng dữ liệu tài chính, xác định yêu cầu chất lượng về tính đầy đủ, chính xác và nhất quán của dữ liệu, cùng tiêu chuẩn nhận diện, kiểm tra và xử lý bất thường.`, description: `Đơn vị chủ trì: Khối QL TCKT — Phối hợp với các đơn vị có liên quan (Khối CNTT, Khối kinh doanh…)làm sạch, chuyển đổi, tổng hợp, xuất dữ liệu, tính toán
Đơn vị phối hợp: Khối CNTT, Khối KD — Phối hợp rà soát dữ liệu
Sáng kiến tiền đề: Hoàn thiện quy tắc xử lý dữ liệu tài chính tự động (thiết lập quy tắc kiểm tra tự động, tính toán tự động và xử lý bất thường, nâng cao tính ổn định và độ chính xác của xử lý dữ liệu).`, outputProduct: `Tiêu chuẩn kiểm soát chất lượng dữ liệu, quy trình kiếm tra xử lý bất thường`, startDate: `Tháng 6/2027`, endDate: `Tháng 12/2028` },
  { tempId: "I10.2.2", level: 3, parent: "I10.2", goalTempId: "G1.3.1", title: `Thiết lập quy tắc xử lý dữ liệu tài chính tự động, xác định logic xử lý, điều kiện thực hiện và quy tắc vận hành của các trường hợp làm sạch, chuyển đổi, tính toán và tổng hợp tự động.`, description: `Đơn vị chủ trì: Khối QL TCKT — Phối hợp với các đơn vị có liên quan (Khối CNTT, Khối kinh doanh…)làm sạch, chuyển đổi, tổng hợp, xuất dữ liệu, tính toán
Đơn vị phối hợp: Khối CNTT, Khối KD — Phối hợp rà soát dữ liệu
Sáng kiến tiền đề: Hoàn thiện quy tắc xử lý dữ liệu tài chính tự động (thiết lập quy tắc kiểm tra tự động, tính toán tự động và xử lý bất thường, nâng cao tính ổn định và độ chính xác của xử lý dữ liệu).`, outputProduct: `Quy tắc xử lý dữ liệu tài chính tự động`, startDate: `Tháng 6/2027`, endDate: `Tháng 12/2028` },
  { tempId: "I11.1.1", level: 3, parent: "I11.1", goalTempId: "G1.3.1", title: `Kết nối ba bên kinh doanh, tài chính và công nghệ, xây dựng tiêu chuẩn phân loại dữ liệu chủ về khách hàng, sản phẩm, ngành, đơn vị và kênh, đồng bộ quan hệ ánh xạ phân loại giữa hệ thống kinh doanh và hệ thống tài chính, bảo đảm tính nhất quán toàn quy trình`, description: `Đơn vị chủ trì: Khối QL TCKT — Kết nối ba bên xây dựng tiêu chuẩn phân loại dữ liệu đa chiều
Đơn vị phối hợp: Khối CNTT, Khối KD, các khối hỗ trợ — Phối hợp xây dựng hệ thống, kết nối dữ liệu đang theo dõi, phân tầng dữ liệu chiều kinh doanh và nhu cầu quản trị hệ thống tài chính tương ứng
Sáng kiến tiền đề: Hoàn thiện quy chuẩn tạo lập kết quả phân tích kinh doanh (thống nhất mẫu báo cáo, quy chuẩn chỉ tiêu và quy tắc tạo lập, thực hiện tự động tạo báo cáo phân tích kinh doanh).`, outputProduct: `Dữ liệu liên kết đa chiều, phân loại hệ thống kinh doanh và hệ thống tài chính`, startDate: `Tháng 01/2028`, endDate: `Tháng 12/2028` },
  { tempId: "I11.1.2", level: 3, parent: "I11.1", goalTempId: "G1.3.1", title: `Thiết lập quy tắc tự động tạo báo cáo phân tích kinh doanh, xác định điều kiện tạo báo cáo, logic gọi dữ liệu, logic tạo nội dung và yêu cầu đầu ra.`, description: `Đơn vị chủ trì: Khối QL TCKT — Thiết lập quy tắc tự động báo cáo, cơ chế và yêu cầu đầu ra
Đơn vị phối hợp: Khối CNTT, Khối KD, các khối hỗ trợ — Xây dựng nhu cầu quản trị tài đơn vị, tham gia thiết kế quy tắc luống tự động
Sáng kiến tiền đề: Hoàn thiện quy chuẩn tạo lập kết quả phân tích kinh doanh (thống nhất mẫu báo cáo, quy chuẩn chỉ tiêu và quy tắc tạo lập, thực hiện tự động tạo báo cáo phân tích kinh doanh).`, outputProduct: `Hoàn thiện quy tắc tạo báo cáo phân tích kinh doanh`, startDate: `Tháng 01/2028`, endDate: `Tháng 12/2028` },
  { tempId: "I11.2.1", level: 3, parent: "I11.2", goalTempId: "G1.3.1", title: `Thiết lập tiêu chuẩn trình bày kết quả phân tích kinh doanh, thống nhất các chiều phân tích, mẫu trình bày, quy chuẩn biểu đồ và tiêu chuẩn trực quan hóa kết quả phân tích kinh doanh.`, description: `Đơn vị chủ trì: Khối QL TCKT — Thiết lập tiêu chuẩn trình bày và tiêu chuẩn trực quan hóa kết quả kinh doanh
Đơn vị phối hợp: Khối CNTT, Khối KD, các khối hỗ trợ — Rà soát nhu cầu, phối hợp đánh giá thực trạng và tiêu chuẩn quản trị
Sáng kiến tiền đề: Hoàn thiện quy chuẩn trình bày kết quả phân tích kinh doanh (thống nhất các chiều phân tích, mẫu trình bày và phương thức trực quan hóa, nâng cao hiệu quả chia sẻ và ứng dụng quản lý kết quả).`, outputProduct: `Thiết lập tiêu chuẩn trình bày KQKD`, startDate: `Tháng 01/2028`, endDate: `Tháng 12/2028` },
  { tempId: "I11.2.2", level: 3, parent: "I11.2", goalTempId: "G1.3.1", title: `Thiết lập quy chuẩn ứng dụng kết quả phân tích kinh doanh, xác định yêu cầu về phát hành, chia sẻ, ứng dụng và quản lý kết quả phân tích kinh doanh.`, description: `Đơn vị chủ trì: Khối QL TCKT — Quy chuẩn về việc thông tin chia sẻ ứng dụng và quản lý Kết quản phân tích kinh doanh
Đơn vị phối hợp: Khối KD, các khối hỗ trợ — Rà soát nhu cầu, phối hợp đánh giá thực trạng và tiêu chuẩn quản trị
Sáng kiến tiền đề: Hoàn thiện quy chuẩn trình bày kết quả phân tích kinh doanh (thống nhất các chiều phân tích, mẫu trình bày và phương thức trực quan hóa, nâng cao hiệu quả chia sẻ và ứng dụng quản lý kết quả).`, outputProduct: `Cơ chế sử dụng và quản lý kết quả phân tích kinh doanh`, startDate: `Tháng 01/2028`, endDate: `Tháng 12/2028` },
  { tempId: "I12.1.1", level: 3, parent: "I12.1", goalTempId: "G1.3.2", title: `Kết nối ba bên kinh doanh, tài chính và công nghệ, xây dựng tiêu chuẩn phân loại dữ liệu chủ về khách hàng, sản phẩm, ngành, đơn vị và kênh, đồng bộ quan hệ ánh xạ phân loại giữa hệ thống kinh doanh và hệ thống tài chính, bảo đảm tính nhất quán toàn quy trình trong phân ngành, phân tầng nhóm khách hàng và phân loại sản phẩm.`, description: `Đơn vị chủ trì: Khối QL TCKT — Xây dựng tiêu chuẩn phân loại dữ liệu đa chiều
Đơn vị phối hợp: Khối KD, khối CNTT — Phân tích thực trạng, nhu cầu quản trị, phân khúc, cơ cấu, sản phẩm…tại đơn vị để cung cấp thông tin khung tiêu chuẩn mong muốn
Sáng kiến tiền đề: Thống nhất dữ liệu chủ và quy chuẩn chỉ tiêu lợi nhuận kinh doanh - tài chính.`, outputProduct: `Phương pháp luận Đo lường lợi nhuận đa chiều (kênh, cơ cấu tổ chức, sản phẩm, khách hàng)`, startDate: `Tháng 12/2026`, endDate: `Tháng 12/2027` },
  { tempId: "I12.1.2", level: 3, parent: "I12.1", goalTempId: "G1.3.2", title: `Xây dựng công cụ hạch toán phân bổ chi phí toàn phần, thực hiện tự động tập hợp chi phí trực tiếp và tự động phân bổ chi phí gián tiếp theo động lực, hỗ trợ tự động lập báo cáo chi phí toàn phần theo từng chiều định kỳ.`, description: `Đơn vị chủ trì: Khối QL TCKT — Công cụ hạch toán phân bổ chi phí
Đơn vị phối hợp: Khối CNTT — Hỗ trợ hệ thống
Sáng kiến tiền đề: Thống nhất dữ liệu chủ và quy chuẩn chỉ tiêu lợi nhuận kinh doanh - tài chính.`, outputProduct: `Công cụ hạch toán phân bổ chi phí toàn diện (hiện SHB đã có hệ thống, tuy nhiên sẽ thực hiện nâng cấp)`, startDate: `Tháng 12/2026`, endDate: `Tháng 12/2027` },
  { tempId: "I12.2.1", level: 3, parent: "I12.2", goalTempId: "G1.3.2", title: `Xây dựng bảng điều khiển kinh doanh cấp tuyến, phân tích xuyên suốt đến các chiều sản phẩm, nhóm khách hàng và cán bộ quản lý khách hàng, hỗ trợ các tuyến chi nhánh thực hiện rà soát kinh doanh hằng ngày và tối ưu hóa cơ cấu khách hàng.`, description: `Đơn vị chủ trì: Khối QL TCKT — Bảng điều khiển kinh doanh cấp tuyến
Đơn vị phối hợp: Khối KD, khối CNTT — Hỗ trợ hệ thống
Sáng kiến tiền đề: Xuất bảng điều khiển dữ liệu lợi nhuận đa chiều theo từng cấp.`, outputProduct: `Bảng điều khiển kinh doanh cấp tuyến, phân tích xuyên suốt đến chiều sản phẩm, nhóm khách hàng và CBQL KH`, startDate: `Tháng 12/2026`, endDate: `Tháng 12/2027` },
  { tempId: "I12.2.2", level: 3, parent: "I12.2", goalTempId: "G1.3.2", title: `Tùy chỉnh bảng theo dõi lợi nhuận dự án chuyên biệt cho các trọng điểm chuyển đổi (như phát triển hệ sinh thái Vietravel), giám sát tiến độ đầu tư và đầu ra theo chu kỳ`, description: `Đơn vị chủ trì: Khối QL TCKT — Bảng thao dõi lợi nhuận dự án chuyên biệt
Đơn vị phối hợp: Khối CNTT,  Khối KD — Hỗ trợ hệ thống
Sáng kiến tiền đề: Xuất bảng điều khiển dữ liệu lợi nhuận đa chiều theo từng cấp.`, outputProduct: `Công cụ tùy chỉnh bảng theo dõi lợi nhuận dự án chuyên biệt cho các trọng tâm chuyển đổi`, startDate: `Tháng 6/2027`, endDate: `Tháng 6/2028` },
  { tempId: "I13.1.1", level: 3, parent: "I13.1", goalTempId: "G1.3.2", title: `Xây dựng công cụ tự động tính toán RAROC/EVA, tự động đo lường kết quả tạo giá trị của từng giao dịch, từng khách hàng, từng ngành và từng dự án, đồng bộ dữ liệu với hệ thống nghiệp vụ`, description: `Đơn vị chủ trì: Khối QL TCKT — Xây dựng Công cụ tự động tính toán RAROC/EVA
Đơn vị phối hợp: Khối KD, Khối QTRR — Phân loại danh mục khách hàng, nhóm khách hàng, ngành nghề chính yếu để cung cấp thông tin xây dựng
Sáng kiến tiền đề: Xây dựng mô hình đo lường RAROC/EVA và quy tắc phân bổ vốn`, outputProduct: `Công cụ tự động tính toán RAROC/EVA`, startDate: `Tháng 1/2029`, endDate: `Tháng 12/2029` },
  { tempId: "I13.2.1", level: 3, parent: "I13.2", goalTempId: "G1.3.2", title: `Thiết lập cơ chế xếp hạng ưu tiên các lĩnh vực dựa trên RAROC, đánh giá hàng quý năng lực tạo giá trị của các ngành chiến lược như xây dựng, dược phẩm và các sản phẩm trọng điểm như tài chính chuỗi cung ứng, đồng thời điều chỉnh linh hoạt thứ tự ưu tiên phân bổ nguồn lực`, description: `Đơn vị chủ trì: Khối QL TCKT — Xây dựng Công cụ tự động tính toán RAROC/EVA
Đơn vị phối hợp: Khối KD, Khối QTRR — Phân loại danh mục khách hàng, nhóm khách hàng, ngành nghề chính yếu để cung cấp thông tin xây dựng
Sáng kiến tiền đề: Xây dựng mô hình đo lường RAROC/EVA và quy tắc phân bổ vốn`, outputProduct: `Công cụ tự động tính toán RAROC/EVA`, startDate: `Tháng 1/2029`, endDate: `Tháng 12/2029` },
  { tempId: "I13.2.2", level: 3, parent: "I13.2", goalTempId: "G1.3.2", title: `Thiết lập cơ chế trích lập thưởng hiệu suất dựa trên EVA, gắn trực tiếp kết quả tạo giá trị với cơ chế khuyến khích dành cho đội nhóm và cá nhân, khuyến khích tuyến đầu phát triển các hoạt động kinh doanh có giá trị cao`, description: `Đơn vị chủ trì: Khối QL TCKT — Cơ chế trích lập thưởng hiệu suất dụa trên EVA
Đơn vị phối hợp: Khối CNTT, Khối KD, Khối QTRR — Hỗ trợ hệ thống
Sáng kiến tiền đề: Ứng dụng trong phân bổ nguồn lực chiến lược`, outputProduct: `Cơ chế trích lập thưởng hiệu suất dụa trên EVA`, startDate: `Tháng 1/2029`, endDate: `Tháng 12/2029` },
  { tempId: "I13.3.1", level: 3, parent: "I13.3", goalTempId: "G1.3.2", title: `Thiết lập cơ chế cảnh báo sớm linh hoạt về lợi nhuận và rủi ro, kịp thời kích hoạt các biện pháp điều chỉnh đối với các lĩnh vực có RAROC liên tục giảm hoặc tỷ lệ nợ xấu vượt chuẩn, bao gồm siết hạn mức, tăng định giá và điều chỉnh tiêu chuẩn tiếp nhận`, description: `Đơn vị chủ trì: Khối QL TCKT — Xây dựng Công cụ tự động tính toán RAROC/EVA và cảnh báo
Đơn vị phối hợp: Khối CNTT, hối QTRR — Hỗ trợ hệ thống
Sáng kiến tiền đề: Ứng dụng trong kiểm soát vốn rủi ro`, outputProduct: `Thiết lập cơ chế cảnh báo sớm linh hoạt về lợi nhuận và rủi ro`, startDate: `Tháng 1/2029`, endDate: `Tháng 12/2029` },
  { tempId: "I14.1.1", level: 3, parent: "I14.1", goalTempId: "G1.4.1", title: `Xây dựng định nghĩa dữ liệu, quy tắc mã hóa và quy chuẩn nghiệp vụ cho các đối tượng dữ liệu cốt lõi như khách hàng, sản phẩm, tài khoản, tổ chức và giao dịch.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy định về Tiêu chuẩn dữ liệu chủ (Master Data)`, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I14.1.2", level: 3, parent: "I14.1", goalTempId: "G1.4.1", title: `Thiết lập quy tắc quản lý phiên bản tiêu chuẩn dữ liệu cốt lõi, chuẩn hóa các yêu cầu về ban hành, thay đổi và ngừng áp dụng tiêu chuẩn.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I14.1.3", level: 3, parent: "I14.1", goalTempId: "G1.4.1", title: `Thiết lập quy tắc ánh xạ tiêu chuẩn dữ liệu cốt lõi, thống nhất mối quan hệ tương ứng giữa các tiêu chuẩn dữ liệu xuyên hệ thống.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I14.2.1", level: 3, parent: "I14.2", goalTempId: "G1.4.1", title: `Xây dựng tiêu chuẩn dữ liệu dùng chung và quy tắc thuộc tính cơ bản về khu vực, ngành, loại tiền tệ và kênh.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy định về Tiêu chuẩn dữ liệu dùng chung (Reference Data)`, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I14.2.2", level: 3, parent: "I14.2", goalTempId: "G1.4.1", title: `Thiết lập cơ chế duy trì tiêu chuẩn dữ liệu dùng chung, thống nhất yêu cầu cập nhật mã dùng chung và quản lý phiên bản.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I15.1.1", level: 3, parent: "I15.1", goalTempId: "G1.4.1", title: `Xây dựng quy trình xây dựng, đánh giá, ban hành, thay đổi và ngừng áp dụng tiêu chuẩn dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.
Sáng kiến tiền đề: 68-70
Ghi chú: có phải là Glossary ko?`, outputProduct: `Quy định Quản lý thông tin đặc tả dữ liệu (Metadata & Business Glossary)`, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I15.1.2", level: 3, parent: "I15.1", goalTempId: "G1.4.1", title: `Thiết lập quy tắc kiểm soát phiên bản và quản lý ban hành tiêu chuẩn dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I15.2.1", level: 3, parent: "I15.2", goalTempId: "G1.4.1", title: `Thiết lập quy tắc kiểm tra thực thi tiêu chuẩn dữ liệu và tiêu chuẩn đánh giá mức độ tuân thủ với Domain được lựa chọn`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy trình quản lý thông tin đặc tả dữ liệu  (Metadata & Business Glossary)`, startDate: `2027-07-01`, endDate: `2027-09-30` },
  { tempId: "I15.2.2", level: 3, parent: "I15.2", goalTempId: "G1.4.1", title: `Thiết lập cơ chế khắc phục, theo dõi và đóng các vấn đề về tiêu chuẩn dữ liệu với Domain được lựa chọn.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-09-30` },
  { tempId: "I15.3.1", level: 3, parent: "I15.3", goalTempId: "G1.4.1", title: `Xây dựng và thống nhất biểu mẫu chung về tài liệu đặc tả dữ liệu`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Phối hợp thống nhất quy trình, quy định và chuẩn hóa tiêu chuẩn, định nghĩa dữ liệu.`, outputProduct: `Bộ mẫu biểu thống nhất`, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I15.3.2", level: 3, parent: "I15.3", goalTempId: "G1.4.1", title: `Xây dựng tool công cụ để quản lý bộ tài liệu đặc tả dữ liệu`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối CNTT — Tham gia phối hợp triển khai công cụ quản lý vận hành bộ tài liệu đặc tả dữ liệu`, outputProduct: `Công cụ quản lý Business Glossary`, startDate: `2027-09-01`, endDate: `2027-12-31` },
  { tempId: "I16.1.1", level: 3, parent: "I16.1", goalTempId: "G1.4.2", title: `Xây dựng tiêu chuẩn đánh giá chất lượng dữ liệu về tính đầy đủ, tính chính xác, tính nhất quán và tính kịp thời.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia thống nhất tiêu chuẩn chất lượng dữ liệu, phối hợp xử lý các lỗi chất lượng dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy định Quản lý chất lượng dữ liệu`, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I16.1.2", level: 3, parent: "I16.1", goalTempId: "G1.4.2", title: `Xác định yêu cầu kiểm soát chất lượng và giá trị mục tiêu đối với các đối tượng dữ liệu trọng điểm.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia thống nhất tiêu chuẩn chất lượng dữ liệu, phối hợp xử lý các lỗi chất lượng dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I16.2.1", level: 3, parent: "I16.2", goalTempId: "G1.4.2", title: `Xây dựng quy tắc kiểm tra chất lượng và nhận diện bất thường đối với các đối tượng dữ liệu trọng điểm.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia thống nhất tiêu chuẩn chất lượng dữ liệu, phối hợp xử lý các lỗi chất lượng dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I16.2.2", level: 3, parent: "I16.2", goalTempId: "G1.4.2", title: `Thiết lập quy tắc kiểm tra tính nhất quán của dữ liệu xuyên hệ thống.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia thống nhất tiêu chuẩn chất lượng dữ liệu, phối hợp xử lý các lỗi chất lượng dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I16.2.3", level: 3, parent: "I16.2", goalTempId: "G1.4.2", title: `Thiết lập quy tắc tự động kiểm tra dữ liệu quan trọng và kích hoạt cảnh báo bất thường.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia thống nhất tiêu chuẩn chất lượng dữ liệu, phối hợp xử lý các lỗi chất lượng dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I17.1.1", level: 3, parent: "I17.1", goalTempId: "G1.4.2", title: `Thiết lập hệ thống chỉ tiêu giám sát chất lượng dữ liệu và quy tắc cảnh báo sớm với Data Domain được lựa chọn`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia thống nhất tiêu chuẩn chất lượng dữ liệu, phối hợp xử lý các lỗi chất lượng dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy trình quản lý DQ`, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I17.1.2", level: 3, parent: "I17.1", goalTempId: "G1.4.2", title: `Thiết lập cơ chế phân tích chất lượng dữ liệu, giám sát xu hướng và phát hành cảnh báo sớm với Data Domain được lựa chọn`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia thống nhất tiêu chuẩn chất lượng dữ liệu, phối hợp xử lý các lỗi chất lượng dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2028-01-01`, endDate: `2028-03-31` },
  { tempId: "I17.2.1", level: 3, parent: "I17.2", goalTempId: "G1.4.2", title: `Thiết lập cơ chế đăng ký, phân công, khắc phục và đóng các vấn đề về chất lượng dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia thống nhất tiêu chuẩn chất lượng dữ liệu, phối hợp xử lý các lỗi chất lượng dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I17.2.2", level: 3, parent: "I17.2", goalTempId: "G1.4.2", title: `Thiết lập cơ chế nâng cấp xử lý, rà soát và cải tiến đối với các vấn đề chất lượng dữ liệu nghiêm trọng.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia thống nhất tiêu chuẩn chất lượng dữ liệu, phối hợp xử lý các lỗi chất lượng dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I17.3.1", level: 3, parent: "I17.3", goalTempId: "G1.4.2", title: `Xây dựng hệ thống dashboard theo dõi và quản lý chất lượng dữ liệu`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối CNTT — Tham gia phối hợp triển khai công cụ quản lý vận hành bộ tài liệu đặc tả dữ liệu
Sáng kiến tiền đề: 68-70
Ghi chú: Triển khai dần theo các datadomain`, outputProduct: `Hệ thống Dashboard DQ`, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I17.3.2", level: 3, parent: "I17.3", goalTempId: "G1.4.2", title: `Triển khai các công cụ quản trị chất lượng dữ liệu, số hóa toàn bộ quy trình quản trị chất lượng dữ liệu`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối CNTT — Tham gia phối hợp triển khai công cụ quản lý vận hành bộ tài liệu đặc tả dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: `Công cụ quản lý DQ`, startDate: `2028-07-01`, endDate: `2028-12-31` },
  { tempId: "I18.1.1", level: 3, parent: "I18.1", goalTempId: "G1.4.3", title: `Thiết lập danh mục tài sản dữ liệu bao phủ toàn ngân hàng và quy tắc mã hóa tài sản thống nhất.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia kiểm kê tài sản dữ liệu, quản lý tài sản dữ liệu theo quy định.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy định quản lý tài sản dữ liệu`, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I18.1.2", level: 3, parent: "I18.1", goalTempId: "G1.4.3", title: `Xác định mối quan hệ sở hữu, chủ thể chịu trách nhiệm và yêu cầu quản lý đối với tài sản dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia kiểm kê tài sản dữ liệu, quản lý tài sản dữ liệu theo quy định.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I18.2.1", level: 3, parent: "I18.2", goalTempId: "G1.4.3", title: `Xây dựng tiêu chuẩn và quy tắc quản lý về phân loại, phân cấp tài sản dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia kiểm kê tài sản dữ liệu, quản lý tài sản dữ liệu theo quy định.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I18.2.2", level: 3, parent: "I18.2", goalTempId: "G1.4.3", title: `Thiết lập quy tắc bảo vệ và sử dụng tài sản dữ liệu theo từng cấp độ.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia kiểm kê tài sản dữ liệu, quản lý tài sản dữ liệu theo quy định.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I19.1.1", level: 3, parent: "I19.1", goalTempId: "G1.4.3", title: `Thiết lập quy tắc chia sẻ, duy trì, đánh giá và quản lý vòng đời tài sản dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia kiểm kê tài sản dữ liệu, quản lý tài sản dữ liệu theo quy định.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy trình quản lý tài sản dữ liệu`, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I19.1.2", level: 3, parent: "I19.1", goalTempId: "G1.4.3", title: `Thiết lập cơ chế đánh giá giá trị và phân tích vận hành tài sản dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia kiểm kê tài sản dữ liệu, quản lý tài sản dữ liệu theo quy định.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I19.2.1", level: 3, parent: "I19.2", goalTempId: "G1.4.3", title: `Thiết lập cơ chế tái sử dụng tài sản dữ liệu trong các kịch bản nghiệp vụ trọng điểm.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia kiểm kê tài sản dữ liệu, quản lý tài sản dữ liệu theo quy định.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I19.2.2", level: 3, parent: "I19.2", goalTempId: "G1.4.3", title: `Thiết lập cơ chế đánh giá hiệu quả ứng dụng và nhân rộng tài sản dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia kiểm kê tài sản dữ liệu, quản lý tài sản dữ liệu theo quy định.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I20.1.1", level: 3, parent: "I20.1", goalTempId: "G1.4.4", title: `Xây dựng quy tắc quản lý đăng ký, phê duyệt, cấp quyền và sử dụng dữ liệu được chia sẻ.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Thống nhất các nguyên tắc chia sử dữ liệu, quản lý các dữ liệu cần chia sẻ.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy định về tiếp cận và chia sẻ dữ liệu Data Access & Sharing Policy`, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I20.1.2", level: 3, parent: "I20.1", goalTempId: "G1.4.4", title: `Xác định rõ phân công trách nhiệm và yêu cầu quản lý đối với việc chia sẻ dữ liệu giữa các bộ phận.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Thống nhất các nguyên tắc chia sử dữ liệu, quản lý các dữ liệu cần chia sẻ.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I20.2.1", level: 3, parent: "I20.2", goalTempId: "G1.4.4", title: `Thiết lập danh mục dịch vụ chia sẻ dữ liệu thống nhất.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Thống nhất các nguyên tắc chia sử dữ liệu, quản lý các dữ liệu cần chia sẻ.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I20.2.2", level: 3, parent: "I20.2", goalTempId: "G1.4.4", title: `Xây dựng giao diện chia sẻ dữ liệu và quy chuẩn dịch vụ theo tiêu chuẩn hóa.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối CNTT — Triển khai hệ thống theo yêu cầu
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I20.2.3", level: 3, parent: "I20.2", goalTempId: "G1.4.4", title: `Thiết lập quy tắc kiểm soát quyền hạn và quản lý việc gọi dịch vụ chia sẻ.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT — Tham gia phối hợp trong quản lý dichj vụ chia sẻ dữ liệu
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I21.1.1", level: 3, parent: "I21.1", goalTempId: "G1.4.4", title: `Thiết lập quy trình, cơ chế thu thập các dữ liệu đang ghi nhận và thu thập thủ công`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối CNTT, Các Khối nghiệp vụ — Tham gia phối hợp triển khai công cụ quản lý vận hành nền tảng thu thập và chia sẻ dữ liệu thủ công
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy định về tập trung các dữ liệu thu thập thủ công`, startDate: `2028-01-01`, endDate: `2028-03-31` },
  { tempId: "I21.1.2", level: 3, parent: "I21.1", goalTempId: "G1.4.4", title: `Xác định rõ vai trò, trách nhiệm của từng bộ phận trong quy trình tập trung hóa dữ liệu thu thập thủ công`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối CNTT, Các Khối nghiệp vụ — Tham gia phối hợp triển khai công cụ quản lý vận hành nền tảng thu thập và chia sẻ dữ liệu thủ công
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2028-01-01`, endDate: `2028-03-31` },
  { tempId: "I21.2.1", level: 3, parent: "I21.2", goalTempId: "G1.4.4", title: `Thiết lập danh mục các dữ liệu thủ công cần thu thập`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối CNTT, Các Khối nghiệp vụ — Tham gia phối hợp triển khai công cụ quản lý vận hành nền tảng thu thập và chia sẻ dữ liệu thủ công
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2028-01-01`, endDate: `2028-03-31` },
  { tempId: "I21.2.2", level: 3, parent: "I21.2", goalTempId: "G1.4.4", title: `Triển khai công cụ nhập liệu, quản lý hệ thống dữ liệu thu thập thủ công`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối CNTT, Các Khối nghiệp vụ — Tham gia phối hợp triển khai công cụ quản lý vận hành nền tảng thu thập và chia sẻ dữ liệu thủ công
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy trình và công cụ quản lý tập trung các dữ liệu thu thập thủ công`, startDate: `2028-01-01`, endDate: `2028-03-31` },
  { tempId: "I22.1.1", level: 3, parent: "I22.1", goalTempId: "G1.4.4", title: `Thiết lập danh mục dịch vụ dữ liệu thống nhất và tiêu chuẩn phân loại dịch vụ.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy định vê dịch vụ dữ liệu`, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I22.1.2", level: 3, parent: "I22.1", goalTempId: "G1.4.4", title: `Xác định đối tượng sử dụng dịch vụ dữ liệu, tiêu chuẩn dịch vụ và phương thức cung cấp dịch vụ.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I22.2.1", level: 3, parent: "I22.2", goalTempId: "G1.4.4", title: `Xây dựng quy trình đăng ký, phát hành, thay đổi và rút dịch vụ dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy trình dịch vụ dữ liệu`, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I22.2.2", level: 3, parent: "I22.2", goalTempId: "G1.4.4", title: `Thiết lập cơ chế giám sát vận hành và đánh giá dịch vụ dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I23.1.1", level: 3, parent: "I23.1", goalTempId: "G1.4.5", title: `Xác định cơ cấu tổ chức quản trị dữ liệu và phân công trách nhiệm giữa các bộ phận.`, description: `Đơn vị chủ trì: Khối QL TCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối QLTCKT, Khối CNTT, Khối HR, các Khối nghiệp vụ, Khối CĐ — Tham gia xây dựng cơ cấu tổ chức QTDL, thống nhất về nguyên tắc và chức năng liên quan đến dữ liệu trên toàn hệ thống
Sáng kiến tiền đề: 68-70`, outputProduct: `Tờ trình, quyết định ban hành về CNNV và cơ cấu tổ chức QTDL tại SHB`, startDate: `Khi sáng kiến được phê duyệt`, endDate: `2026-12-31` },
  { tempId: "I23.1.2", level: 3, parent: "I23.1", goalTempId: "G1.4.5", title: `Xây dựng nguồn lực, tổ chức nhân sự đầu mối triển khai năng lực quản trị dữ liệu`, description: `Đơn vị chủ trì: Khối QL TCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Khối QLTCKT, Khối CNTT, Khối HR, các Khối nghiệp vụ, Khối CĐ — Tham gia xây dựng cơ cấu tổ chức QTDL, thống nhất về nguyên tắc và chức năng liên quan đến dữ liệu trên toàn hệ thống
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `Khi sáng kiến được phê duyệt`, endDate: `2026-12-31` },
  { tempId: "I23.2.1", level: 3, parent: "I23.2", goalTempId: "G1.4.5", title: `Xây dựng thể chế, quy chuẩn quản lý và quy trình công việc về quản trị dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy định về QTDL tại SHB`, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I23.2.2", level: 3, parent: "I23.2", goalTempId: "G1.4.5", title: `Thiết lập cơ chế ban hành, cập nhật và quản lý thực thi thể chế quản trị dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I24.1.1", level: 3, parent: "I24.1", goalTempId: "G1.4.5", title: `Xây dựng hệ thống chỉ tiêu và tiêu chuẩn đánh giá quản trị dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy trình Quản trị dữ liệu tại SHB`, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I24.1.2", level: 3, parent: "I24.1", goalTempId: "G1.4.5", title: `Thiết lập cơ chế đánh giá mức độ trưởng thành quản trị dữ liệu và báo cáo đánh giá.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I24.1.3", level: 3, parent: "I24.1", goalTempId: "G1.4.5", title: `Thiết lập hệ thống đánh giá quản trị dữ liệu.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-01-01`, endDate: `2027-06-30` },
  { tempId: "I24.2.1", level: 3, parent: "I24.2", goalTempId: "G1.4.5", title: `Thiết lập cơ chế theo dõi khắc phục vấn đề quản trị dữ liệu và xác minh hiệu quả.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I24.2.2", level: 3, parent: "I24.2", goalTempId: "G1.4.5", title: `Thiết lập cơ chế liên tục tối ưu hóa quản trị dữ liệu và tích lũy kinh nghiệm.`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I25.1.1", level: 3, parent: "I25.1", goalTempId: "G1.4.6", title: `Xây dựng cộng đồng Data Champion và tài liệu hướng dẫn vận hành`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT, các ĐVKD — Phối hợp triển khai văn hóa dữ liệu toàn hệ thống
Sáng kiến tiền đề: 68-70`, outputProduct: `Quy định văn hóa dữ liệu tại SHB`, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I25.1.2", level: 3, parent: "I25.1", goalTempId: "G1.4.6", title: `Thiết lập cơ chế truyền thông về chuyển đổi văn hóa dữ liệu`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT, các ĐVKD — Phối hợp triển khai văn hóa dữ liệu toàn hệ thống
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I25.2.1", level: 3, parent: "I25.2", goalTempId: "G1.4.6", title: `Thiết lập cơ chế đo lường mức độ chuyển đổi và tuân thủ về QTDL`, description: `Đơn vị chủ trì: Khối QLTCKT — Xây dựng quy trình, quy định, công cụ và quản lý vận hành.
Đơn vị phối hợp: Các Khối nghiệp vụ, Khối CNTT, các ĐVKD — Phối hợp triển khai văn hóa dữ liệu toàn hệ thống
Sáng kiến tiền đề: 68-70`, outputProduct: null, startDate: `2027-07-01`, endDate: `2027-12-31` },
  { tempId: "I26.1.1", level: 3, parent: "I26.1", goalTempId: "G1.5.1", title: `Rà soát và xác định định giá FTP theo sát chiến lược khách hàng của Khối NHBL - Huy động vốn`, description: `Đơn vị chủ trì: ALM — Xây dựng cơ chế FTP tương ứng cho từng sáng kiến của Khối NHBL liên quan đến khách hàng và sản phẩm
Đơn vị phối hợp: Khối NHBL — Phối hợp mô tả sản phẩm, khách hàng, chiến lược và xây dựng cơ chế điều chuyển vốn phù hợp`, outputProduct: `Cơ chế FTP tương ứng cho khách hàng, sàn phẩm của Khối NHBL`, startDate: `1/1/2027
Theo timeline tương ứng của sáng kiến của Khối NHBL và mỗi khi có sản phẩm mới`, endDate: `31/12/2027
Trước khi sản phẩm mới được ban hành` },
  { tempId: "I26.1.2", level: 3, parent: "I26.1", goalTempId: "G1.5.1", title: `Rà soát và xác định định giá FTP theo sát chiến lược khách hàng của Khối NHBL - Sử dụng vốn`, description: ``, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I26.2.1", level: 3, parent: "I26.2", goalTempId: "G1.5.1", title: `Rà soát và xác định định giá FTP theo sát chiến lược khách hàng của Khối NHDN - Huy động`, description: `Đơn vị chủ trì: ALM — Xây dựng cơ chế FTP tương ứng cho từng sáng kiến của Khối NHDN liên quan đến khách hàng và sản phẩm
Đơn vị phối hợp: Khối NHDN — Phối hợp mô tả sản phẩm, khách hàng, chiến lược và xây dựng cơ chế điều chuyển vốn phù hợp`, outputProduct: `Cơ chế FTP tương ứng cho khách hàng, sàn phẩm của Khối NHDN`, startDate: `1/1/2027
Theo timeline tương ứng của sáng kiến của Khối NHDN và mỗi khi có sản phẩm mới`, endDate: `31/12/2027
Trước khi sản phẩm mới được ban hành` },
  { tempId: "I26.2.2", level: 3, parent: "I26.2", goalTempId: "G1.5.1", title: `Rà soát và xác định định giá FTP theo sát chiến lược khách hàng của Khối NHDN - Cho vay`, description: ``, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I27.2.1", level: 3, parent: "I27.2", goalTempId: "G1.5.2", title: `Xây dựng cấu phần giá trị ngưỡng chi phí hoạt động quản lý`, description: ``, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I27.2.2", level: 3, parent: "I27.2", goalTempId: "G1.5.2", title: `Xây dựng cấu phần phần bù rủi ro tín dụng (EL): theo các phương pháp hướng tới tính EL theo từng khoản vay`, description: ``, outputProduct: null, startDate: null, endDate: null },
  { tempId: "I27.2.3", level: 3, parent: "I27.2", goalTempId: "G1.5.2", title: `Xây dựng tỷ suất lợi nhuận trên rủi ro tiêu chuẩn (RORWA)`, description: ``, outputProduct: null, startDate: null, endDate: null },
];
